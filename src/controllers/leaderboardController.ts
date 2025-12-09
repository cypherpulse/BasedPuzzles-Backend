import { Request, Response } from 'express';
import Game from '../models/Score'; // renamed to Game
import User from '../models/User';
import { LeaderboardEntry } from '../types';

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameMode, limit = 10, offset = 0 } = req.query;

    if (!gameMode || !['sudoku', 'crossword'].includes(gameMode as string)) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid gameMode' }
      });
      return;
    }

    const games = await Game.find({
      gameMode,
      completed: true
    })
    .sort({ score: -1, timeTaken: 1 })
    .skip(Number(offset))
    .limit(Number(limit));

    const total = await Game.countDocuments({ gameMode, completed: true });

    const entries: LeaderboardEntry[] = [];
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      const user = await User.findOne({ walletAddress: game.walletAddress });
      entries.push({
        rank: Number(offset) + i + 1,
        walletAddress: game.walletAddress,
        username: user?.username,
        bestTime: game.timeTaken,
        score: game.score,
        gameMode: game.gameMode,
        difficulty: game.difficulty,
        completedAt: game.playedAt.toISOString()
      });
    }

    res.json({
      success: true,
      data: entries,
      total
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch leaderboard' }
    });
  }
};