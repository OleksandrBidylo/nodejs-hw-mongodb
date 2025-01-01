import createError from 'http-errors';
import Contact from '../models/contact.js';

const getContacts = async ({ page, perPage, sortBy, sortOrder }) => {
  const totalItems = await Contact.countDocuments();
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const contacts = await Contact.find()
    .skip((page - 1) * perPage)
    .limit(Number(perPage))
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

  return {
    data: contacts,
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
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
