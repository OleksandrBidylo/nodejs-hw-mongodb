import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routers/auth.js';

dotenv.config();

function setupServer() {
  const app = express();

  app.use(express.json());

  app.use('/auth', authRouter);

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
  });

  const mongoUri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Database connected');
      const PORT = process.env.PORT || 3002;
      app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}`),
      );
    })
    .catch((err) => {
      console.error('Database connection error:', err.message);
    });

  return app;
}

export default setupServer;
