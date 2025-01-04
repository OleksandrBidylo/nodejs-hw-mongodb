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
import authenticate from '../middlewares/authenticate.js';
const router = express.Router();

router.use(authenticate);
router.get('/', getContactsCtrl);
router.get('/:contactId', isValidId, getContactByIdCtrl);
router.post('/', validateBody(contactValidationSchema), createContactCtrl);
router.patch(
  '/:contactId',
  isValidId,
  validateBody(contactValidationSchema),
  updateContactCtrl,
);
router.delete('/:contactId', isValidId, deleteContactCtrl);

export default router;
