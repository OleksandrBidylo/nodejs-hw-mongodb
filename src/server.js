const express = require('express');
const cors = require('cors');
const pino = require('pino');
const contactsRouter = require('./services/contacts');

const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
      },
    },
  });

  app.use((req, res, next) => {
    logger.info({ req });
    next();
  });

  app.use('/contacts', contactsRouter);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

module.exports = setupServer;
