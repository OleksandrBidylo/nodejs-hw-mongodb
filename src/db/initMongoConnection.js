import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

const initMongoConnection = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connection established!');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    throw err;
  }
};

export default initMongoConnection;
