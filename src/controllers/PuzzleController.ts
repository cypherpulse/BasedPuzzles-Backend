import { Request, Response } from 'express';
import DailyPuzzle from '../models/Puzzle'; // renamed
import { DailyPuzzleResponse } from '../types';

export const getDailyPuzzle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameMode, date } = req.query;

    if (!gameMode || !['sudoku', 'crossword'].includes(gameMode as string)) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid gameMode' }
      });
      return;
    }

    const puzzleDate = date ? new Date(date as string) : new Date();
    const dateStr = puzzleDate.toISOString().split('T')[0];
    const puzzleId = `daily-${gameMode}-${dateStr}`;

    let puzzle = await DailyPuzzle.findOne({ id: puzzleId });

    if (!puzzle) {
      // Create stub puzzle
      const stubGrid = gameMode === 'sudoku' ? [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
      ] : {}; // stub for crossword

      const expiresAt = new Date(puzzleDate);
      expiresAt.setDate(expiresAt.getDate() + 1);

      puzzle = new DailyPuzzle({
        id: puzzleId,
        gameMode,
        difficulty: 'medium',
        grid: stubGrid,
        date: puzzleDate,
        expiresAt
      });
      await puzzle.save();
    }

    const response: DailyPuzzleResponse = {
      id: puzzle.id,
      gameMode: puzzle.gameMode,
      difficulty: puzzle.difficulty,
      grid: puzzle.grid,
      date: puzzle.date.toISOString().split('T')[0],
      expiresAt: puzzle.expiresAt.toISOString()
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Daily puzzle error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch daily puzzle' }
    });
  }
};