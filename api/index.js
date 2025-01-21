const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Create a memory adapter that will act as our database
const memory = require('json-server/lib/server/router/memory');
const db = require('./db.json');
const router = jsonServer.router(memory.create(db));

// Enable CORS for all requests
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.header(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Add custom middleware to log database state
server.use((req, res, next) => {
  console.log('Current DB State:', router.db.getState());
  next();
});

server.use(middlewares);
server.use(router);

// Add error handling
server.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});
