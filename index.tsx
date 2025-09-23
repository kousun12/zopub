import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { html } from "hono/html";
import config from "./zosite.json";

const app = new Hono();

const css = `
  body {
    font-family: 'Playfair Display', serif;
    background-color: #e6d7c3;
    margin: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .text {
    font-size: 2rem;
    color: black;
  }
`;

const Layout: FC = (props) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <title>{config.name}</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
        <style>{css}</style>
      </head>
      <body>{props.children}</body>
    </html>
  );
};

app.get("/", (c) => {
  return c.html(
    <Layout>
      <div class="text">Rob's public stuff</div>
    </Layout>,
  );
});

export default {
  fetch: app.fetch,
  port: config.local_port,
};
