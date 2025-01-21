const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Safely load the database
let db;
try {
  // Try to load from the included db.json file
  db = require(path.join(process.cwd(), 'db.json'));
} catch (error) {
  console.error('Error loading db.json:', error);
  // Fallback to empty database if file cannot be loaded
  db = {
    invoices: [],
    products: [],
  };
}

// Create router with the database object directly
const router = jsonServer.router(db);

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

// Add request logging
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  const currentDB = router.db.getState();
  console.log('Current DB State:', JSON.stringify(currentDB, null, 2));
  next();
});

// Add middleware to clone the db state for each request
server.use((req, res, next) => {
  router.db.setState({ ...db });
  next();
});

server.use(middlewares);
server.use(router);

// Error handling
server.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

module.exports = server;
