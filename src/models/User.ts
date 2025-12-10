import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types';

export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, unique: true, lowercase: true, index: true },
  username: { type: String },
  avatarUrl: { type: String },
  joinedAt: { type: Date, default: Date.now },
  totalGames: { type: Number, default: 0 },
  gamesWon: { type: Number, default: 0 },
  bestSudokuTime: { type: Number },
  bestCrosswordTime: { type: Number },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  totalPlayTime: { type: Number, default: 0 },
  lastPlayed: { type: Date },
  lastCompleted: { type: Date },
  totalCompletions: { type: Number, default: 0 },
  achievements: { type: [String], default: [] },
});

export default mongoose.model<IUserDocument>('User', UserSchema);
