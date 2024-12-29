import createError from 'http-errors';
import Contact from '../models/contact.js';

const getContacts = async () => {
  return await Contact.find();
};

const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) throw createError(404, 'Contact not found');
  return contact;
};

const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

const updateContact = async (id, updates) => {
  const contact = await Contact.findByIdAndUpdate(id, updates, { new: true });
  if (!contact) throw createError(404, 'Contact not found');
  return contact;
};

const deleteContact = async (id) => {
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) throw createError(404, 'Contact not found');
  return contact;
};

export {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
