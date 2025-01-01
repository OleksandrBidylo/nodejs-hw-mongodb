import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const getContactsCtrl = ctrlWrapper(async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
  } = req.query;

  const contactsData = await getContacts({ page, perPage, sortBy, sortOrder });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData,
  });
});

const getContactByIdCtrl = ctrlWrapper(async (req, res) => {
  const contact = await getContactById(req.params.contactId);
  res.json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
});

const createContactCtrl = ctrlWrapper(async (req, res) => {
  const contact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created contact!',
    data: contact,
  });
});

const updateContactCtrl = ctrlWrapper(async (req, res) => {
  const contact = await updateContact(req.params.contactId, req.body);
  res.json({
    status: 200,
    message: 'Successfully updated contact!',
    data: contact,
  });
});

const deleteContactCtrl = ctrlWrapper(async (req, res) => {
  await deleteContact(req.params.contactId);
  res.status(204).send();
});

export {
  getContactsCtrl,
  getContactByIdCtrl,
  createContactCtrl,
  updateContactCtrl,
  deleteContactCtrl,
};
