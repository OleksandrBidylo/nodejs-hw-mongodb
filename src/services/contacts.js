import Contact from '../models/contact.js';

const getContacts = async () => {
  try {
    return await Contact.find();
  } catch (err) {
    throw new Error('Failed to get contacts');
  }
};

const getContactById = async (id) => {
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (err) {
    throw new Error('Failed to get contact by ID');
  }
};

export { getContacts, getContactById };
