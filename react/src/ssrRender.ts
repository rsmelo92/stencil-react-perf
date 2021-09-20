import ReactDOMServer from 'react-dom/server';
import { renderToString } from '../../core/hydrate';

export const renderReact = async (jsx: JSX.Element): Promise<string> => {
  const startTime = Date.now();

  const rawHtml = ReactDOMServer.renderToString(jsx);
  const renderReactTime = Date.now();

  const { html } = await renderToString(rawHtml);
  const renderWCTime = Date.now();

  console.info(`[DEBUG]
    firstRender: ${renderReactTime - startTime}ms,
    secondRender: ${renderWCTime - renderReactTime}ms,
    total: ${renderWCTime - startTime}ms
  `.replace(/\s{2}|\n/gi, '').trim(), { startTime, renderReactTime, renderWCTime });
  return html;
}
