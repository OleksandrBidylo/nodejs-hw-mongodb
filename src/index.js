import dotenv from 'dotenv';
import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';

dotenv.config();

initMongoConnection()
  .then(() => {
    setupServer();
  })
  .catch((err) => console.log('Database connection error:', err));
