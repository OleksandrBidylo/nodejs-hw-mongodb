import express from 'express';
import {
  getContactsCtrl,
  getContactByIdCtrl,
  createContactCtrl,
  updateContactCtrl,
  deleteContactCtrl,
} from '../controllers/contacts.js';
import { validateBody } from '../models/contactValidation.js';
import { contactValidationSchema } from '../models/contactValidation.js';
import isValidId from '../middlewares/isValidId.js';

const router = express.Router();

router.get('/', getContactsCtrl);
router.get('/:contactId', isValidId, getContactByIdCtrl);
router.post('/', validateBody(contactValidationSchema), createContactCtrl);
router.patch(
  '/:contactId',
  isValidId,
  validateBody(contactValidationSchema),
  updateContactCtrl,
); // Валідація body + ID
router.delete('/:contactId', isValidId, deleteContactCtrl);

export default router;
