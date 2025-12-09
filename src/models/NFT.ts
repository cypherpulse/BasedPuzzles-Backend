import mongoose, { Schema, Document } from 'mongoose';
import { INFT } from '../types';

export interface INFTDocument extends INFT, Document {}

const NFTSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, lowercase: true, index: true },
  tokenId: { type: Number, required: true },
  contractAddress: { type: String, required: true },
  achievementType: { type: String, required: true },
  mintedAt: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed, required: true },
});

export default mongoose.model<INFTDocument>('NFT', NFTSchema);