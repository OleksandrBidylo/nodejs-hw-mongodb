import express from 'express';
import {
  registerCtrl,
  loginCtrl,
  refreshCtrl,
  logoutCtrl,
} from '../controllers/auth.js';

const router = express.Router();

router.post('/register', registerCtrl);
router.post('/login', loginCtrl);
router.post('/refresh', refreshCtrl);
router.post('/logout', logoutCtrl);

export default router;
