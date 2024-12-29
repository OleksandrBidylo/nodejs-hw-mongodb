import setupServer from './server.js';

setupServer().catch((error) => {
  console.error('Error while starting server:', error);
  process.exit(1);
});
