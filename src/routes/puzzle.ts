import { Router } from 'express';
import { getDailyPuzzle } from '../controllers/PuzzleController';

const router: Router = Router();

router.get('/daily', getDailyPuzzle);

export default router;