import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routers/auth.js';

function setupServer() {
  const app = express();

  app.use(express.json());

  app.use('/auth', authRouter);

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
  });

  return app;
}

export async function startServer() {
  const app = setupServer();

  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase');
    console.log('Database connected');

    const PORT = 3000;
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`),
    );
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
}

export default setupServer;
