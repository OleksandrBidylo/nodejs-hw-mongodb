const express = require('express');
const Contact = require('../models/contact');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:contactId', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
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
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
