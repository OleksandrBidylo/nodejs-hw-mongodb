import express from 'express';
import cors from 'cors';
import pino from 'pino';
import router from './routers/contacts.js';
import initMongoConnection from './db/initMongoConnection.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import { config } from 'dotenv';

config();

const setupServer = async () => {
  await initMongoConnection();

  const app = express();

  app.use(cors());
  app.use(express.json());

  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:standard' },
    },
  });

  app.use((req, res, next) => {
    logger.info({ req });
    next();
  });

  app.use('/contacts', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  return app;
};

export default setupServer;
