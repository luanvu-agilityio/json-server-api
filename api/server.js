const jsonServer = require('json-server');
const server = jsonServer.create();

// Important: use static data instead of file
const db = {
  invoices: [],
  products: [],
};

const router = jsonServer.router(db); // Use db object directly
const middlewares = jsonServer.defaults();

// Handle CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

server.use(middlewares);
server.use(router);

module.exports = server;
