import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));
const distDirectory = join(currentDirectory, 'dist');
const port = Number(process.env.PORT ?? 3000);
const serviceUnavailableMessage = 'Analysis service is temporarily unavailable. Please try again later.';

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
]);

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
};

const readRequestBody = (request) =>
  new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      resolve(body);
    });

    request.on('error', reject);
  });

const handleWebhookRequest = async (request, response) => {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed' });
    return;
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('N8N_WEBHOOK_URL is not configured; analysis service is unavailable.');
    sendJson(response, 503, { error: serviceUnavailableMessage });
    return;
  }

  try {
    const body = await readRequestBody(request);
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!webhookResponse.ok) {
      console.warn(`n8n webhook returned status ${webhookResponse.status}; analysis service is unavailable.`);
      sendJson(response, 503, { error: serviceUnavailableMessage });
      return;
    }

    const data = await webhookResponse.json();
    sendJson(response, 200, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to call webhook';
    console.warn(`n8n webhook request failed: ${message}`);
    sendJson(response, 503, { error: serviceUnavailableMessage });
  }
};

const getStaticFilePath = (pathname) => {
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const normalizedPath = normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, '');

  return join(distDirectory, normalizedPath);
};

const serveStaticFile = async (request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const filePath = getStaticFilePath(requestUrl.pathname);

  try {
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      throw new Error('Requested path is not a file');
    }

    response.writeHead(200, {
      'Content-Type': contentTypes.get(extname(filePath)) ?? 'application/octet-stream',
    });
    createReadStream(filePath).pipe(response);
  } catch {
    const indexHtml = await readFile(join(distDirectory, 'index.html'), 'utf8');
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(indexHtml);
  }
};

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  if (requestUrl.pathname === '/api/webhook') {
    await handleWebhookRequest(request, response);
    return;
  }

  await serveStaticFile(request, response);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Validon server listening on port ${port}`);
});
