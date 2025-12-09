import { Response } from 'express';
import User from '../models/User';
import NFT from '../models/NFT';
import { WalletRequest, UserStats, UserProfile, NFTBadge, UpdateUserProfileRequest } from '../types';

export const getUserStats = async (req: WalletRequest, res: Response): Promise<void> => {
  try {
    const walletAddress = req.walletAddress!;
    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = new User({ walletAddress, joinedAt: new Date() });
      await user.save();
    }

    const stats: UserStats = {
      walletAddress: user.walletAddress,
      totalGames: user.totalGames,
      gamesWon: user.gamesWon,
      bestSudokuTime: user.bestSudokuTime,
      bestCrosswordTime: user.bestCrosswordTime,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      averageScore: user.averageScore,
      totalPlayTime: user.totalPlayTime,
      lastPlayed: user.lastPlayed?.toISOString(),
      achievements: user.achievements
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch user stats' }
    });
  }
};

export const getUserProfile = async (req: WalletRequest, res: Response): Promise<void> => {
  try {
    const walletAddress = req.walletAddress!;
    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = new User({ walletAddress, joinedAt: new Date() });
      await user.save();
    }

    const nfts = await NFT.find({ walletAddress });
    const nftBadges: NFTBadge[] = nfts.map(nft => ({
      id: nft.achievementType,
      name: nft.metadata.name || nft.achievementType,
      image: nft.metadata.image || '',
      earnedAt: nft.mintedAt.toISOString()
    }));

    const profile: UserProfile = {
      walletAddress: user.walletAddress,
      username: user.username,
      avatar: user.avatarUrl,
      joinedAt: user.joinedAt.toISOString(),
      nftBadges,
      totalRewards: nfts.length
    };

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('User profile error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch user profile' }
    });
  }
};

export const updateUserProfile = async (req: WalletRequest, res: Response): Promise<void> => {
  try {
    const walletAddress = req.walletAddress!;
    const { username, avatarUrl }: UpdateUserProfileRequest = req.body;

    // Basic validation
    if (username && (username.length < 2 || username.length > 30)) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Username must be between 2 and 30 characters' }
      });
      return;
    }

    if (avatarUrl && !avatarUrl.startsWith('ipfs://') && !avatarUrl.startsWith('http')) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Avatar URL must be a valid IPFS or HTTP URL' }
      });
      return;
    }

    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = new User({ walletAddress, joinedAt: new Date() });
    }

    // Update fields if provided
    if (username !== undefined) {
      user.username = username;
    }
    if (avatarUrl !== undefined) {
      user.avatarUrl = avatarUrl;
    }

    await user.save();

    res.json({
      success: true,
      data: {
        walletAddress: user.walletAddress,
        username: user.username,
        avatar: user.avatarUrl,
        joinedAt: user.joinedAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to update user profile' }
    });
  }
};