# [CLAUDE.md](http://CLAUDE.md)

This file provides guidance to Claude Code ([claude.ai/code](http://claude.ai/code)) when working with code in this repository.

## Project Structure

This repository contains a workout tracking web application built with modern TypeScript tooling:

- **Main application**: current working directory containing a Hono-based web server
- **Runtime**: Bun (JavaScript runtime and package manager)
- **Framework**: Hono (lightweight web framework) with JSX support

You are working in a Hono app that allows users to build and host interactive web pages from their zo computer. 

The user might ask you to make changes to the codebase, add new features, or fix bugs.  

The files you need to edit will be in this space. If you run bash commands make sure to use this directory as the `cwd` for your commands.  

You can install dependencies (via bun add), modify files, and run commands in this space.  

It is important to remember that installing new dependencies is for adding SERVER-SIDE dependencies. 
To serve client-side dependencies, you should use a CDN like [esm.sh](http://esm.sh), [cdn.jsdelivr.net](http://cdn.jsdelivr.net) or [unpkg.com](http://unpkg.com) and import them in your client-side code. This is because the server environment and the client environment are separate, and dependencies installed on the server will not be available to the client. 

Much of the frontend code will generally be relatively plain HTML/CSS/JS or JSX, and you can use CDNs to import any libraries you need. 
For UI intensive pages, you can pull in hono/jsx from [esm.sh](http://esm.sh) and use that to build interactive components. 

For styling, you can bring in TailwindCSS via CDN if needed.  

Think carefully about their ask, and modify the codebase if appropriate. 

If the user's ask is complex and the details are not clear, ask for clarification if necessary before starting.  

### Hono Application
read Hono documentation if necessary: <https://honojs.dev/llms-small.txt> 
Remember this is Bun NOT Deno or Node.js.

Important parts described below: 

Serve static files
To serve static files, use serveStatic imported from hono/bun.
```ts
import { serveStatic } from 'hono/bun'
const app = new Hono()
app.use('/static/*', serveStatic({root: './' }))
app.use('/favicon.ico', serveStatic({path: './favicon.ico' }))
app.get('/', (c) => c.text('You can access: /static/hello.txt'))
app.get('*', serveStatic({path: './static/fallback.txt' }))
// (you can also reach up into parent directories, including outside the project root to files in the user's workspace if needed)
app.get('/other', serveStatic({path: '../some/dir/other.txt' }))
app.get('/absolute-file', serveStatic({path: '/home/workspace/foo/my-file.txt' }))

// you can also specify custom MIME types if needed:
app.get(
  '/somefolder/*',
  serveStatic({
    mimes: {
      m3u8: 'application/vnd.apple.mpegurl',
      ts: 'video/mp2t',
    },
  })
)
```

To serve REST API endpoints:
```ts
app.get('/', (c) => c.json('list authors'))
app.post('/', (c) => c.json('create an author', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))
```

If you need interactive client-side code, either use vanilla JS or JSX. this can be either included in the html file or served as a separate file.
For an example of how to include interactive JSX via hono's JSX support, see below. you can import esm modules into your client-side code.:
```ts
const clientJS = `
import { createElement, render } from 'https://esm.sh/hono/jsx/dom';
import { useState } from 'https://esm.sh/hono/jsx';
function Counter() {
  const state = useState(0);
  const count = state[0];
  const setCount = state[1];
  return createElement('div', null,
    createElement('p', null, 'Count: ' + count),
    createElement('button', { onClick: function () { setCount(count + 1); } }, 'Increment')
  );
}

function App() {
  return createElement('div', null, createElement(Counter, {}));
}

const root = document.getElementById('client-root');
if (root) {
  render(createElement(App, {}), root);
}`;
```

And in your main server file, serve html with a reference to client code:
```html
  <body>
    <script type="module" src="/client.js"></script>
  </body>
```

```ts
app.get('/client.js', (c) => c.body(clientJS, 200, { 'Content-Type': 'application/javascript' }));
```

`hono/jsx` supports an Async Component, so you can use `async`/`await` in your component.
If you render it with `c.html()`, it will await automatically.

```ts
const AsyncComponent = async () => {
  await new Promise((r) => setTimeout(r, 1000)) // sleep 1s
  return <div>Done!</div>
}
app.get('/', (c) => {
  return c.html(
    <html>
      <body>
        <AsyncComponent />
      </body>
    </html>
  )
})
```

You can register middleware using `app.use` or using `app.HTTP_METHOD` as well as the handlers. For this feature, it's easy to specify the path and the method.
```ts
// match any method, all routes
app.use(logger())

// specify path
app.use('/posts/*', cors())

// specify method and path
app.post('/posts/*', basicAuth())
```

If the handler returns `Response`, it will be used for the end-user, and stopping the processing.

```ts
app.post('/posts', (c) => c.text('Created!', 201))
```

In this case, four middleware are processed before dispatching like this:

```
logger() -> cors() -> basicAuth() -> *handler*
```

Hono has built-in middlewares.
```ts
import { basicAuth } from 'hono/basic-auth'
app.use(
  '/mystuff/*',
  basicAuth({ username: 'hono', password: 'acoolproject' })
)
```

### Database

This app is database agnostic and by default does not come with any database built in. For most things sqlite will suffice. In that case,
use Bun's sqlite support via `import { Database } from "bun:sqlite"`

### Configuration Files

- `file package.json` : Defines npm scripts and dependencies (Hono, Bun types)
- `file tsconfig.json` : TypeScript compiler settings with strict mode and JSX support
- `file zosite.json` : Application configuration including port and deployment settings

This application is designed for personal use, running locally on this Zo computer host with the ability to be published publicly, also from this single host.

Because it will always be running from this host, you are free to read and write to the file system, and run subprocesses, always assuming you are on this user's specific Zo computer.