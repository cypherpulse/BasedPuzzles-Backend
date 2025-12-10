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
  lastCompleted?: Date;
  totalCompletions: number;
  achievements: string[];
}
export interface IGame {
  walletAddress: string;
  gameMode: GameMode;
  difficulty: Difficulty;
  puzzleId: string;
  score: number;
  timeTaken: number;
  completed: boolean;
  hintsUsed: number;
  playedAt: Date;
}
export interface ISession {
  walletAddress: string;
  gameMode: GameMode;
  puzzleId: string;
  currentGrid: any;
  gridState: any;
  elapsedTime: number;
  hintsUsed: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface INFT {
  walletAddress: string;
  tokenId: number;
  achievementType: string;
  txHash: string;
  mintedAt: Date;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
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
export interface NFTBadge {
  id: string;
  name: string;
  image: string;
  earnedAt: string;
}
export interface UserProfile {
  walletAddress: string;
  username?: string;
  avatar?: string;
  joinedAt: string;
  stats?: UserStats;
  nftBadges: NFTBadge[];
  totalRewards?: number;
}
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
export interface SubmitGameRequest {
  gameMode: GameMode;
  difficulty: Difficulty;
  puzzleId: string;
  score: number;
  timeTaken: number;
  completed: boolean;
  hintsUsed: number;
}
export interface SubmitGameResponse {
  newRank: number;
  newStreak: number;
  nftEarned?: string;
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
export interface VerifySolutionRequest {
  puzzleId: string;
  solution: any;
  timeTaken: number;
  clientTimestamp: number;
}
export interface VerifySolutionResponse {
  success: boolean;
  rank: number;
  newStreak: number;
  rewards?: string[];
  nftMinted: boolean;
}
