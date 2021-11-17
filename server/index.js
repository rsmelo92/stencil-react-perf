const React = require('react');
const express = require('express');
const { MyComponent } = require('../react/dist/index.js');
const { renderReact } = require('../react/dist/ssrRender.js');

const PORT = 1337;
const RENDER_TIMES = 1000;

const renderMany = (element) => {
  return React.createElement('div', {},
    Array.from(new Array(RENDER_TIMES)).map((_, key) => {
      return React.createElement(element, { key });
    })
  );
}

const renderFullPage = (html) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR Test</title>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;
}

const app = express();

app.get('/', async (_, res) => {
  const Component = React.createElement(MyComponent)

  const html = await renderReact(Component);
  const fullPage = renderFullPage(html);

  res.send(fullPage);
});

app.get('/thousand', async (_, res) => {
  const Components = renderMany(MyComponent);

  const html = await renderReact(Components);
  const fullPage = renderFullPage(html);

  res.send(fullPage);
});

app.listen(PORT, () => {
  console.log(`
    Listening on http://localhost:${PORT}
    Test performance on http://localhost:${PORT}/thousand
  `);
});
