import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import authRouter from './routers/auth.js';
import contactsRouter from './routers/contacts.js';
import initMongoConnection from './db/initMongoConnection.js';

import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

dotenv.config();

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard' },
  },
});

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    logger.info({ req });
    next();
  });

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  return app;
};

const initApp = async () => {
  await initMongoConnection();
  setupServer();
};

export default initApp;
