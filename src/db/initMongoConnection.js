const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Contact = require('../models/contact');
require('dotenv').config();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

async function initMongoConnection() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connection established!');

    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      const contactsPath = path.join(__dirname, '../contacts.json');
      const contactsData = JSON.parse(fs.readFileSync(contactsPath, 'utf-8'));

      await Contact.insertMany(contactsData);
      console.log('Contacts imported successfully from contacts.json');
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
}

module.exports = initMongoConnection;
