import { Request } from 'express';

export type GameMode = 'sudoku' | 'crossword';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface WalletRequest extends Request {
  walletAddress?: string;
}

export interface IUser {
  walletAddress: string;
  username?: string;
  avatarUrl?: string;
  joinedAt: Date;
  totalGames: number;
  gamesWon: number;
  bestSudokuTime?: number;
  bestCrosswordTime?: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  totalPlayTime: number;
  lastPlayed?: Date;
  achievements: string[];
}

export interface IGame {
  walletAddress: string;
  gameMode: GameMode;
  difficulty: Difficulty;
  timeTaken: number;
  score: number;
  completed: boolean;
  hintsUsed: number;
  playedAt: Date;
  dailyId?: string;
}

export interface IDailyPuzzle {
  gameMode: GameMode;
  difficulty: Difficulty;
  grid: any; // JSON
  date: Date;
  expiresAt: Date;
}

export interface ISession {
  walletAddress: string;
  gameMode: GameMode;
  puzzleId: string;
  gridState: any; // JSON
  elapsedTime: number;
  hintsUsed: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface INFT {
  walletAddress: string;
  tokenId: number;
  contractAddress: string;
  achievementType: string;
  mintedAt: Date;
  metadata: any; // JSON
}

// DTOs
export interface LeaderboardEntry {
  rank: number;
  walletAddress: string;
  username?: string;
  bestTime: number;
  score: number;
  gameMode: GameMode;
  difficulty: Difficulty;
  completedAt: string;
}

export interface UserStats {
  walletAddress: string;
  totalGames: number;
  gamesWon: number;
  bestSudokuTime?: number;
  bestCrosswordTime?: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  totalPlayTime: number;
  lastPlayed?: string;
  achievements: string[];
}

export interface SubmitGameRequest {
  gameMode: GameMode;
  difficulty: Difficulty;
  timeTaken: number;
  score: number;
  completed: boolean;
  hintsUsed: number;
}

export interface SubmitGameResponse {
  newRank: number;
  newStreak: number;
  nftEarned?: string;
}

export interface DailyPuzzleResponse {
  id: string;
  gameMode: GameMode;
  difficulty: Difficulty;
  grid: any;
  date: string;
  expiresAt: string;
}

export interface UserProfile {
  walletAddress: string;
  username?: string;
  avatar?: string;
  joinedAt: string;
  nftBadges: NFTBadge[];
  totalRewards: number;
}

export interface NFTBadge {
  id: string;
  name: string;
  image: string;
  earnedAt: string;
}

export interface SaveSessionRequest {
  gameMode: GameMode;
  puzzleId: string;
  currentGrid: any;
  elapsedTime: number;
  hintsUsed: number;
}

export interface SaveSessionResponse {
  sessionId: string;
  expiresAt: string;
}

export interface LoadSessionResponse {
  gameMode: GameMode;
  puzzleId: string;
  currentGrid: any;
  elapsedTime: number;
  hintsUsed: number;
}

export interface MintNFTRequest {
  achievement: string;
  metadata: any;
}

export interface MintNFTResponse {
  txHash: string;
  tokenId: number;
  nftContract: string;
}

export interface UpdateUserProfileRequest {
  username?: string;
  avatarUrl?: string;
}