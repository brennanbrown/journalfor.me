import { Router } from 'express';
let authController: any;
if (process.env.NODE_ENV === 'test') {
  authController = require('../controllers/authController-test');
} else {
  authController = require('../controllers/authController');
}
const { register, login } = authController;
import { validateRegister, validateLogin } from '../middleware/validation';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;
