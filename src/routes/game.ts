import { Router } from 'express';
import { submitGame, saveSession, loadSession } from '../controllers/gameController';
import { requireWallet } from '../middleware/auth';

const router: Router = Router();

router.post('/submit', requireWallet, submitGame);
router.post('/session', requireWallet, saveSession);
router.get('/session/:sessionId', requireWallet, loadSession);

export default router;