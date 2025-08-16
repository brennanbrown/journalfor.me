import { Router } from 'express';
let entriesController: any;
if (process.env.NODE_ENV === 'test') {
  entriesController = require('../controllers/entriesController-test');
} else {
  entriesController = require('../controllers/entriesController');
}
const { getEntries, getEntry, createEntry, updateEntry, deleteEntry } = entriesController;
import { authenticateToken } from '../middleware/auth';
import { validateCreateEntry, validateUpdateEntry } from '../middleware/validation';

const router = Router();

// All entry routes require authentication
router.use(authenticateToken);

router.get('/', getEntries);
router.post('/', validateCreateEntry, createEntry);
router.put('/:id', validateUpdateEntry, updateEntry);
router.delete('/:id', deleteEntry);

export default router;
