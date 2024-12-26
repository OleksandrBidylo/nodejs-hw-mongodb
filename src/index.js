const initMongoConnection = require('./db/initMongoConnection');
const setupServer = require('./server');

initMongoConnection()
  .then(() => {
    setupServer();
  })
  .catch((err) => console.log('Database connection error:', err));
