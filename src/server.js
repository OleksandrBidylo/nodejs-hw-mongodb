import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { getContacts, getContactById } from './services/contacts.js';

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

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getContacts();
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const contact = await getContactById(req.params.contactId);
      if (!contact) {
        return res.status(404).json({
          message: `Contact with id ${req.params.contactId} not found!`,
        });
      }

      res.json({
        status: 200,
        message: `Found contact with id ${req.params.contactId}!`,
        data: contact,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

export default setupServer;
