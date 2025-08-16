import { Router } from 'express';
import {
  getEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry
} from '../controllers/entriesController';
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
