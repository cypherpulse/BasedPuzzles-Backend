import { Request, Response, NextFunction } from 'express';

export interface WalletRequest extends Request {
  walletAddress?: string;
}

export const walletMiddleware = (req: WalletRequest, res: Response, next: NextFunction): void => {
  const walletAddress = req.headers['x-wallet-address'] as string;

  if (walletAddress) {
    // Basic EVM address validation
    if (walletAddress.length === 42 && walletAddress.startsWith('0x') && /^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      req.walletAddress = walletAddress.toLowerCase();
    } else {
      res.status(400).json({ success: false, error: { code: 'INVALID_WALLET', message: 'Invalid wallet address format' } });
      return;
    }
  }

  next();
};

export const requireWallet = (req: WalletRequest, res: Response, next: NextFunction): void => {
  if (!req.walletAddress) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'x-wallet-address header required' } });
    return;
  }
  next();
};