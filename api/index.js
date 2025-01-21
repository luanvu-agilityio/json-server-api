const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const fs = require('fs');
const { json } = require('stream/consumers');

const getRouter = () => {
  const dbPath = path.join(process.cwd(), 'db.json');
  let db;
  try {
    const dbData = fs.readFileSync(dbPath, 'utf8');
    db = JSON.parse(dbData);
  } catch (error) {
    console.error('Error loading db.json:', error);
    db = {
      invoices: [],
      products: [],
    };
  }
  return jsonServer.router(db);
};

// Enable CORS for all requests
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

server.use(middlewares);

server.use((req, res, next) => {
  const router = getRouter();
  router(req, res, next);
});

// Error handling
server.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

module.exports = server;
