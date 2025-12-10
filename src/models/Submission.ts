import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission {
  puzzleId: string;
  walletAddress: string;
  solution: any;
  timeTaken: number;
  isCorrect: boolean;
  clientTimestamp: number;
  submittedAt: Date;
}

export interface ISubmissionDocument extends ISubmission, Document {}

const SubmissionSchema = new Schema<ISubmissionDocument>(
  {
    puzzleId: { type: String, required: true, index: true },
    walletAddress: { type: String, required: true, index: true },
    solution: { type: Schema.Types.Mixed, required: true },
    timeTaken: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    clientTimestamp: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

SubmissionSchema.index({ puzzleId: 1, walletAddress: 1 });
SubmissionSchema.index({ walletAddress: 1, submittedAt: -1 });

export default mongoose.model<ISubmissionDocument>('Submission', SubmissionSchema);
