const express = require('express');
const Contact = require('../models/contact');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Fetching contacts...');
    const contacts = await Contact.find();

    if (!contacts || contacts.length === 0) {
      console.log('No contacts found');
    }

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:contactId', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId); // Поиск контакта по ID
    if (contact) {
      res.json({
        status: 200,
        message: `Found contact with id ${req.params.contactId}!`,
        data: contact,
      });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (err) {
    console.error('Error fetching contact by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
