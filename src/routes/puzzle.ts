import { Router } from 'express';
import { getDailyPuzzle, verifySolution } from '../controllers/PuzzleController';
import { requireWallet } from '../middleware/auth';

const router: Router = Router();

router.get('/daily', getDailyPuzzle);
router.post('/verify', requireWallet, verifySolution);

export default router;
