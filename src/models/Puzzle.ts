import mongoose, { Schema, Document } from 'mongoose';
import { GameMode, Difficulty } from '../types';

export interface IDailyPuzzleDocument extends Document {
  id: string;
  gameMode: GameMode;
  difficulty: Difficulty;
  grid: any;
  solution: any;
  clues?: any;
  theme?: string;
  date: Date;
  expiresAt: Date;
}

const DailyPuzzleSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  gameMode: { type: String, required: true, enum: ['sudoku', 'crossword'] },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  grid: { type: Schema.Types.Mixed, required: true },
  solution: { type: Schema.Types.Mixed, required: true },
  clues: { type: Schema.Types.Mixed },
  theme: { type: String },
  date: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<IDailyPuzzleDocument>('DailyPuzzle', DailyPuzzleSchema);
