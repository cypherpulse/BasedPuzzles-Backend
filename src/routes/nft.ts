import { Router } from 'express';
import { mintNFT } from '../controllers/nftController';
import { requireWallet } from '../middleware/auth';

const router: Router = Router();

router.post('/mint', requireWallet, mintNFT);

export default router;