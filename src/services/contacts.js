import createError from 'http-errors';
import Contact from '../models/contact.js';

const getContacts = async ({ page, perPage, sortBy, sortOrder, userId }) => {
  const totalItems = await Contact.countDocuments({ userId });
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const contacts = await Contact.find({ userId })
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

const getContactById = async (id, userId) => {
  const contact = await Contact.findOne({ _id: id, userId });
  if (!contact) throw createError(404, 'Contact not found or access denied');
  return contact;
};

const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

const updateContact = async (id, updates, userId) => {
  const contact = await Contact.findOneAndUpdate({ _id: id, userId }, updates, {
    new: true,
  });
  if (!contact) throw createError(404, 'Contact not found or access denied');
  return contact;
};

const deleteContact = async (id, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: id, userId });
  if (!contact) throw createError(404, 'Contact not found or access denied');
  return contact;
};

export {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
