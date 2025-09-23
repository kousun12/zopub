import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { html } from "hono/html";
import config from "./zosite.json";

const app = new Hono();

/*
  An App meant to run on localhost, served by a Zo computer for a single user.
  The runtime is Bun. You can use any locally installed packages, and you can also use
  any system / filesystem apis via Bun core.

  Much of this file is just placeholder content, meant to be replaced by user code.
  The only parts that are necessary are the Hono app and the export at the end.
  The Hono app can be configured to serve any kind of application the user wants.

  For docs on how to use Hono, including routing, middleware, and more, navigate the docs at:
  https://hono.dev/llms.txt
 */

// Basic CSS -- to be replaced with user requests
const boilerplateCSS = html`
  :root { color-scheme: light dark; --surface: #ffffff; --text: #0a0a0a;
  --primary: #6366f1; --primaryAlt: #8b5cf6; } @media (prefers-color-scheme:
  dark) { :root { --surface: #0f1115; --text: #eef1f5; --primary: #8b5cf6;
  --primaryAlt: #6366f1; } } body { margin: 0; font-family: -apple-system,
  system-ui, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial,
  Apple Color Emoji, Segoe UI Emoji, sans-serif; } *, *::before, *::after {
  box-sizing: border-box; font-family: inherit; } .wrap { min-height: 100vh;
  display: grid; place-items: center; padding: 24px; } .card { max-width: 640px;
  width: 100%; border: 2px solid transparent; border-radius: 12px; padding:
  24px; box-shadow: 0 1px 2px rgba(0,0,0,.06); background:
  linear-gradient(var(--surface), var(--surface)) padding-box,
  linear-gradient(90deg, rgba(99,102,241,0), rgba(99,102,241,0.35),
  rgba(99,102,241,0), rgba(139,92,246,0.35), rgba(99,102,241,0)) border-box;
  background-size: auto, 200% 100%; background-position: 0 0, 0% 0%;
  background-clip: padding-box, border-box; color: var(--text); animation:
  shimmer-scan 10000ms ease-in-out infinite; font-family: -apple-system,
  system-ui, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial,
  Apple Color Emoji, Segoe UI Emoji, sans-serif; } @keyframes shimmer-scan { 0%
  { background-position: 0 0, 0% 0%; } 100% { background-position: 0 0, 200% 0%;
  } } h1 { font-size: 20px; margin: 0 0 8px; font-family: inherit; } p { margin:
  0 0 12px; line-height: 1.5; font-family: inherit; }
`;

const Layout: FC = (props) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <title>{config.name}</title>
        <style>{boilerplateCSS}</style>
      </head>
      <body>{props.children}</body>
    </html>
  );
};

const BoilerplateContent = () => {
  return (
    <main className="wrap">
      <section className="card">
        <h1>{config.name}</h1>
        <p>You've just created a new site hosted from your Zo Computer.</p>
        <p>
          Sites can house one or more interactive pages and/or power an API.
        </p>
        <p>
          You can make any number of sites from your Zo computer and configure
          access so that they are either private to you or accessible to the
          public.
        </p>
        <p>
          Sites let you make personal tools, share content based on data on your
          computer, publish writing, make digital art, or even host a game. Use
          your imagination. Zo can help you get started or explore
          possibilities.
        </p>
      </section>
    </main>
  );
};

app.get("/", (c) => {
  return c.html(
    <Layout>
      <BoilerplateContent />
    </Layout>,
  );
});

export default {
  fetch: app.fetch,
  port: config.local_port,
};
