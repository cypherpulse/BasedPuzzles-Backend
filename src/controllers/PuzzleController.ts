import { Request, Response } from "express";
import DailyPuzzle from "../models/Puzzle";
import Submission from "../models/Submission";
import User from "../models/User";
import { WalletRequest, VerifySolutionRequest, VerifySolutionResponse } from "../types";

export const getDailyPuzzle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameMode } = req.params;
    const { date } = req.query;

    if (!gameMode || !["sudoku", "crossword"].includes(gameMode)) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid gameMode" }
      });
      return;
    }

    const puzzleDate = date ? new Date(date as string) : new Date();
    const dateStr = puzzleDate.toISOString().split("T")[0];
    const puzzleId = `daily-${gameMode}-${dateStr}`;

    let puzzle = await DailyPuzzle.findOne({ id: puzzleId });

    if (!puzzle) {
      // Create stub puzzle with solution (for demo purposes)
      const stubData = createStubPuzzle(gameMode);

      const expiresAt = new Date(puzzleDate);
      expiresAt.setDate(expiresAt.getDate() + 1);

      puzzle = new DailyPuzzle({
        id: puzzleId,
        gameMode,
        difficulty: "medium",
        grid: stubData.grid,
        solution: stubData.solution,
        clues: stubData.clues,
        theme: stubData.theme,
        date: puzzleDate,
        expiresAt
      });
      await puzzle.save();
    }

    // Never send solution to frontend
    const response = {
      id: puzzle.id,
      gameMode: puzzle.gameMode,
      difficulty: puzzle.difficulty,
      date: puzzle.date.toISOString().split("T")[0],
      grid: puzzle.grid,
      ...(puzzle.gameMode === "crossword" && puzzle.clues && {
        width: 7, // Assuming standard crossword size
        height: 7,
        clues: puzzle.clues
      }),
      ...(puzzle.theme && { theme: puzzle.theme })
    };

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error("Get daily puzzle error:", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch daily puzzle" }
    });
  }
};

export const verifySolution = async (req: WalletRequest, res: Response): Promise<void> => {
  try {
    const walletAddress = req.walletAddress!;
    const { puzzleId, solution, timeTaken, clientTimestamp }: VerifySolutionRequest = req.body;

    // Validation
    if (!puzzleId || !solution || timeTaken <= 0) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid submission data" }
      });
      return;
    }

    // Check if puzzle exists
    const puzzle = await DailyPuzzle.findOne({ id: puzzleId });
    if (!puzzle) {
      res.status(400).json({
        success: false,
        error: { code: "INVALID_PUZZLE", message: "Puzzle does not exist" }
      });
      return;
    }

    // Check if puzzle has expired (24-hour window)
    const now = new Date();
    if (now > puzzle.expiresAt) {
      res.status(400).json({
        success: false,
        error: { code: "PUZZLE_EXPIRED", message: "Puzzle submission window has closed" }
      });
      return;
    }

    // Check rate limiting (max 5 submissions per day per user)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const submissionsToday = await Submission.countDocuments({
      walletAddress,
      submittedAt: { $gte: today }
    });

    if (submissionsToday >= 5) {
      res.status(429).json({
        success: false,
        error: { code: "RATE_LIMITED", message: "Maximum submissions reached for today" }
      });
      return;
    }

    // Check if user already submitted correct solution for this puzzle
    const existingCorrectSubmission = await Submission.findOne({
      puzzleId,
      walletAddress,
      isCorrect: true
    });

    if (existingCorrectSubmission) {
      res.status(400).json({
        success: false,
        error: { code: "ALREADY_COMPLETED", message: "Puzzle already completed" }
      });
      return;
    }

    // Verify solution
    const isCorrect = verifyPuzzleSolution(puzzle.solution, solution);

    // Record submission attempt
    const submission = new Submission({
      puzzleId,
      walletAddress,
      solution,
      timeTaken,
      isCorrect,
      clientTimestamp: new Date(clientTimestamp)
    });
    await submission.save();

    if (!isCorrect) {
      res.json({
        success: false,
        error: "Incorrect solution"
      });
      return;
    }

    // Solution is correct - update user stats
    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = new User({ walletAddress, joinedAt: new Date() });
    }

    // Update streak logic
    const todayStr = now.toISOString().split("T")[0];
    const lastCompletedStr = user.lastCompleted?.toISOString().split("T")[0];

    if (user.lastCompleted && lastCompletedStr === todayStr) {
      // Already completed a puzzle today, don't update streak
    } else if (user.lastCompleted && isConsecutiveDay(user.lastCompleted, now)) {
      user.currentStreak += 1;
    } else {
      user.currentStreak = 1;
    }

    user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
    user.lastCompleted = now;
    user.totalCompletions = (user.totalCompletions || 0) + 1;

    // Check for achievements
    const rewards: string[] = [];
    if (user.currentStreak >= 7) rewards.push("7-Day Streak");
    if (user.currentStreak >= 30) rewards.push("30-Day Streak");
    if (user.totalCompletions >= 100) rewards.push("Century Club");

    user.achievements = [...new Set([...(user.achievements || []), ...rewards])];
    await user.save();

    // Calculate rank
    const betterSubmissions = await Submission.countDocuments({
      puzzleId,
      isCorrect: true,
      $or: [
        { timeTaken: { $lt: timeTaken } },
        { timeTaken: timeTaken, submittedAt: { $lt: submission.submittedAt } }
      ]
    });

    const rank = betterSubmissions + 1;

    const response: VerifySolutionResponse = {
      success: true,
      rank,
      newStreak: user.currentStreak,
      rewards: rewards.length > 0 ? rewards : undefined,
      nftMinted: false // Will be true when NFT integration is added
    };

    res.json({ success: true, data: response });

  } catch (error) {
    console.error("Verify solution error:", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to verify solution" }
    });
  }
};

// Helper function to create stub puzzle data
function createStubPuzzle(gameMode: string) {
  if (gameMode === "sudoku") {
    return {
      grid: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
      ],
      solution: [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
      ],
      clues: undefined,
      theme: undefined
    };
  } else {
    // Crossword stub
    return {
      grid: {},
      solution: {},
      clues: {
        across: [
          { number: 1, clue: "Sample clue 1", startRow: 0, startCol: 0, length: 5 },
          { number: 2, clue: "Sample clue 2", startRow: 1, startCol: 0, length: 4 }
        ],
        down: [
          { number: 1, clue: "Sample down clue", startRow: 0, startCol: 0, length: 3 }
        ]
      },
      theme: "Sample Theme"
    };
  }
}

// Helper function to verify puzzle solution
function verifyPuzzleSolution(correctSolution: any, submittedSolution: any): boolean {
  // For Sudoku: compare arrays
  if (Array.isArray(correctSolution) && Array.isArray(submittedSolution)) {
    if (correctSolution.length !== submittedSolution.length) return false;

    for (let i = 0; i < correctSolution.length; i++) {
      if (Array.isArray(correctSolution[i]) && Array.isArray(submittedSolution[i])) {
        if (correctSolution[i].length !== submittedSolution[i].length) return false;

        for (let j = 0; j < correctSolution[i].length; j++) {
          if (correctSolution[i][j] !== submittedSolution[i][j]) return false;
        }
      } else if (correctSolution[i] !== submittedSolution[i]) {
        return false;
      }
    }
    return true;
  }

  // For other puzzle types, add specific verification logic
  return false;
}

// Helper function to check if dates are consecutive
function isConsecutiveDay(lastDate: Date, currentDate: Date): boolean {
  const oneDay = 24 * 60 * 60 * 1000;
  const diff = currentDate.getTime() - lastDate.getTime();
  return diff >= oneDay && diff < 2 * oneDay;
}
