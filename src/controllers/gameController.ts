import { Response } from 'express';
import Game from '../models/Score'; // Game model
import User from '../models/User';
import Session from '../models/Session';
import { WalletRequest, SubmitGameRequest, SubmitGameResponse, SaveSessionRequest, SaveSessionResponse, LoadSessionResponse } from '../types';

export const submitGame = async (req: WalletRequest, res: Response): Promise<void> => {
  try {
    const walletAddress = req.walletAddress!;
    const { gameMode, difficulty, timeTaken, score, completed, hintsUsed }: SubmitGameRequest = req.body;

    // Validation
    if (!gameMode || !difficulty || timeTaken <= 0 || score < 0 || hintsUsed < 0) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid game data' }
      });
      return;
    }

    // Create game record
    const game = new Game({
      walletAddress,
      gameMode,
      difficulty,
      timeTaken,
      score,
      completed,
      hintsUsed
    });
    await game.save();

    // Update user stats
    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = new User({ walletAddress, joinedAt: new Date() });
    }

    user.totalGames += 1;
    if (completed) {
      user.gamesWon += 1;
    }

    // Update best times
    if (completed) {
      if (gameMode === 'sudoku' && (!user.bestSudokuTime || timeTaken < user.bestSudokuTime)) {
        user.bestSudokuTime = timeTaken;
      } else if (gameMode === 'crossword' && (!user.bestCrosswordTime || timeTaken < user.bestCrosswordTime)) {
        user.bestCrosswordTime = timeTaken;
      }
    }

    // Update streak
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (user.lastPlayed && user.lastPlayed >= yesterday && user.lastPlayed < now) {
      user.currentStreak += 1;
    } else if (!user.lastPlayed || user.lastPlayed < yesterday) {
      user.currentStreak = completed ? 1 : 0;
    }

    user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
    user.averageScore = ((user.averageScore * (user.totalGames - 1)) + score) / user.totalGames;
    user.totalPlayTime += timeTaken;
    user.lastPlayed = now;

    await user.save();

    // Calculate new rank (simplified)
    const betterGames = await Game.countDocuments({
      gameMode,
      completed: true,
      $or: [
        { score: { $gt: score } },
        { score: score, timeTaken: { $lt: timeTaken } }
      ]
    });
    const newRank = betterGames + 1;

    const response: SubmitGameResponse = {
      newRank,
      newStreak: user.currentStreak,
      nftEarned: user.currentStreak >= 10 ? 'StreakMaster' : undefined
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Submit game error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to submit game' }
    });
  }
};

export const saveSession = async (req: WalletRequest, res: Response): Promise<void> => {
  try {
    const walletAddress = req.walletAddress!;
    const { gameMode, puzzleId, currentGrid, elapsedTime, hintsUsed }: SaveSessionRequest = req.body;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = await Session.findOneAndUpdate(
      { walletAddress, gameMode, puzzleId },
      {
        gridState: currentGrid,
        elapsedTime,
        hintsUsed,
        expiresAt
      },
      { upsert: true, new: true }
    );

    const response: SaveSessionResponse = {
      sessionId: session._id.toString(),
      expiresAt: expiresAt.toISOString()
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Save session error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to save session' }
    });
  }
};

export const loadSession = async (req: WalletRequest, res: Response): Promise<void> => {
  try {
    const walletAddress = req.walletAddress!;
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session || session.walletAddress !== walletAddress) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Session not found' }
      });
      return;
    }

    const response: LoadSessionResponse = {
      gameMode: session.gameMode,
      puzzleId: session.puzzleId,
      currentGrid: session.gridState,
      elapsedTime: session.elapsedTime,
      hintsUsed: session.hintsUsed
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Load session error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to load session' }
    });
  }
};