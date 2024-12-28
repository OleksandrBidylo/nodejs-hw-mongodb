import Contact from '../models/contact.js';

const getContacts = async () => {
  return await Contact.find();
};

const getContactById = async (id) => {
  return await Contact.findById(id);
};

export { getContacts, getContactById };
