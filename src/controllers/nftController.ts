import { Response } from 'express';
import NFT from '../models/NFT';
import { WalletRequest, MintNFTRequest, MintNFTResponse } from '../types';

export const mintNFT = async (req: WalletRequest, res: Response): Promise<void> => {
  try {
    const walletAddress = req.walletAddress!;
    const { achievement, metadata }: MintNFTRequest = req.body;

    // For v1, fake minting
    const tokenId = Date.now(); // fake token ID
    const contractAddress = '0xFAKE_CONTRACT_ADDRESS';

    const nft = new NFT({
      walletAddress,
      tokenId,
      contractAddress,
      achievementType: achievement,
      metadata
    });
    await nft.save();

    const response: MintNFTResponse = {
      txHash: '0xFAKE_TX_HASH',
      tokenId,
      nftContract: contractAddress
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Mint NFT error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to mint NFT' }
    });
  }
};