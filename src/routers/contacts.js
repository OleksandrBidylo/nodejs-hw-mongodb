import express from 'express';
import {
  getContactsCtrl,
  getContactByIdCtrl,
  createContactCtrl,
  updateContactCtrl,
  deleteContactCtrl,
} from '../controllers/contacts.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import {
  contactSchema,
  updateContactSchema,
} from '../models/contactValidation.js';

const router = express.Router();

router.get('/', getContactsCtrl);
router.get('/:contactId', isValidId, getContactByIdCtrl);
router.post('/', validateBody(contactSchema), createContactCtrl);
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  updateContactCtrl,
);
router.delete('/:contactId', isValidId, deleteContactCtrl);

export default router;
