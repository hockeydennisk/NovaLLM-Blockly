import fs from 'fs/promises';
import http from 'http';
import path from 'path';
import { URL } from 'url';

const PORT = Number(process.env.LOCAL_DB_PORT || 3030);
const dbPath = process.env.LOCAL_DB_PATH || path.resolve(process.cwd(), 'data', 'local-db.json');

async function ensureDbFile() {
  const dir = path.dirname(dbPath);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify({ templates: [] }, null, 2), 'utf-8');
  }
}

async function readDb() {
  await ensureDbFile();
  const content = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(content);
}

async function writeDb(data) {
  await ensureDbFile();
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf-8'));
}

const server = http.createServer(async (req, res) => {
  const method = req.method || 'GET';
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (method === 'GET' && requestUrl.pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok', dbPath });
    return;
  }

  if (method === 'GET' && requestUrl.pathname === '/api/templates') {
    const db = await readDb();
    const templates = Array.isArray(db.templates) ? db.templates : [];
    templates.sort((a, b) => +new Date(b.savedAt) - +new Date(a.savedAt));
    sendJson(res, 200, templates);
    return;
  }

  if (method === 'POST' && requestUrl.pathname === '/api/templates') {
    const body = await parseBody(req);
    const { name, xml, prompt } = body || {};

    if (!name || !xml) {
      sendJson(res, 400, { error: 'name and xml are required' });
      return;
    }

    const db = await readDb();
    const templates = Array.isArray(db.templates) ? db.templates : [];
    const now = new Date().toISOString();
    const template = {
      id: `tpl_${Date.now()}`,
      name,
      xml,
      prompt: prompt || '',
      savedAt: now,
      updatedAt: now,
    };
    templates.unshift(template);
    db.templates = templates;
    await writeDb(db);
    sendJson(res, 201, template);
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Local template DB API running on http://localhost:${PORT}`);
  console.log(`Database file: ${dbPath}`);
});
