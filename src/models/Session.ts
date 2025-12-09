import mongoose, { Schema, Document } from 'mongoose';
import { ISession } from '../types';

export interface ISessionDocument extends ISession, Document {}

const SessionSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, lowercase: true, index: true },
  gameMode: { type: String, required: true, enum: ['sudoku', 'crossword'] },
  puzzleId: { type: String, required: true, index: true },
  gridState: { type: Schema.Types.Mixed, required: true },
  elapsedTime: { type: Number, required: true },
  hintsUsed: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<ISessionDocument>('Session', SessionSchema);