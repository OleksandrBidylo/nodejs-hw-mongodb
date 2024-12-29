import express from 'express';
import {
  getContactsCtrl,
  getContactByIdCtrl,
  createContactCtrl,
  updateContactCtrl,
  deleteContactCtrl,
} from '../controllers/contacts.js';

const router = express.Router();

router.get('/', getContactsCtrl);
router.get('/:contactId', getContactByIdCtrl);
router.post('/', createContactCtrl);
router.patch('/:contactId', updateContactCtrl);
router.delete('/:contactId', deleteContactCtrl);

export default router;
