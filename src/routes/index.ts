import { Router } from 'express';
import leaderboardRoutes from './leaderboard';
import userRoutes from './user';
import gameRoutes from './game';
import puzzleRoutes from './puzzle';
import nftRoutes from './nft';

const router: Router = Router();

// Routes
router.use('/leaderboard', leaderboardRoutes);
router.use('/user', userRoutes);
router.use('/games', gameRoutes);
router.use('/puzzles', puzzleRoutes);
router.use('/nfts', nftRoutes);

export default router;