import { Router } from 'express';
import { getUserStats, getUserProfile, updateUserProfile } from '../controllers/userController';
import { requireWallet } from '../middleware/auth';

const router: Router = Router();

router.get('/stats', requireWallet, getUserStats);
router.get('/profile', requireWallet, getUserProfile);
router.put('/profile', requireWallet, updateUserProfile);

export default router;