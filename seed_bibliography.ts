import { Database } from "bun:sqlite";
import * as fs from "fs";

interface BibliographyEntry {
  title: string;
  author: string | null;
  noun: string | null;
  year: number | null;
  url: string | null;
}

function parseBibliography(content: string): BibliographyEntry[] {
  const entries: BibliographyEntry[] = [];
  
  // Split into lines and filter for entries that start with "- **["
  const lines = content.split('\n');
  const entryLines = lines.filter(line => line.trim().startsWith('- **['));
  
  for (const line of entryLines) {
    try {
      // Parse format: - **[Title](URL)** - *noun, Author*
      const match = line.match(/- \*\*\[([^\]]+)\]\(([^)]+)\)\*\* - \*([^*]+)\*/);
      
      if (match) {
        const [, title, url, metadata] = match;
        
        // Parse metadata (format: "noun, Author" or just "noun")
        const metadataParts = metadata.split(',').map(part => part.trim());
        const noun = metadataParts[0] || null;
        const author = metadataParts.length > 1 ? metadataParts.slice(1).join(', ').trim() : null;
        
        // Try to extract year from title (look for 4-digit numbers)
        const yearMatch = title.match(/(\d{4})/);
        const year = yearMatch ? parseInt(yearMatch[1]) : null;
        
        entries.push({
          title: title.trim(),
          author,
          noun,
          year,
          url: url.trim()
        });
      } else {
        console.warn(`Could not parse line: ${line}`);
      }
    } catch (error) {
      console.error(`Error parsing line: ${line}`, error);
    }
  }
  
  return entries;
}

function seedDatabase() {
  try {
    // Read the bibliography file
    const content = fs.readFileSync('./res/bibliography.md', 'utf8');
    
    // Parse entries
    const entries = parseBibliography(content);
    console.log(`Parsed ${entries.length} entries from bibliography.md`);
    
    // Open database
    const db = new Database('./bibliography.db');
    
    // Clear existing data (optional - remove this line if you want to keep existing data)
    db.run('DELETE FROM bibliography');
    
    // Prepare insert statement
    const insertStmt = db.prepare(`
      INSERT INTO bibliography (title, author, noun, year, url) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    // Insert entries
    let inserted = 0;
    for (const entry of entries) {
      try {
        insertStmt.run(entry.title, entry.author, entry.noun, entry.year, entry.url);
        inserted++;
      } catch (error) {
        console.error(`Error inserting entry: ${entry.title}`, error);
      }
    }
    
    insertStmt.finalize();
    db.close();
    
    console.log(`Successfully inserted ${inserted} entries into the database`);
    
    // Show a few sample entries
    const sampleDb = new Database('./bibliography.db');
    const samples = sampleDb.prepare('SELECT * FROM bibliography LIMIT 5').all();
    console.log('\nSample entries:');
    console.table(samples);
    sampleDb.close();
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding
seedDatabase();