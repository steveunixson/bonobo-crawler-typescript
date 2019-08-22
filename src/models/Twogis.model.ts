import mongoose, { Schema } from 'mongoose';
import TwogisModelInterface from '../interfaces/TwogisModel.interface';

const TwogisSchema: Schema = new Schema({
  phoneNumber: { type: String, unique: true },
  companyName: { type: String },
  address: { type: String },
  city: { type: String },
  site: { type: String },
  search: { type: String },
  tags: { type: String },
  hours: { type: String },
});

export default mongoose.model<TwogisModelInterface>('Twogis', TwogisSchema);
