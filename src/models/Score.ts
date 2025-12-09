import mongoose, { Schema, Document } from 'mongoose';
import { IGame } from '../types';

export interface IGameDocument extends IGame, Document {}

const GameSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, lowercase: true, index: true },
  gameMode: { type: String, required: true, enum: ['sudoku', 'crossword'], index: true },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  timeTaken: { type: Number, required: true },
  score: { type: Number, required: true, index: true },
  completed: { type: Boolean, required: true },
  hintsUsed: { type: Number, required: true },
  playedAt: { type: Date, default: Date.now },
  dailyId: { type: String },
});

export default mongoose.model<IGameDocument>('Game', GameSchema);