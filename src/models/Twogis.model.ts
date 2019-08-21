import mongoose, { Schema } from 'mongoose';
import TwogisModelInterface from '../interfaces/TwogisModel.interface';

const TwogisSchema: Schema = new Schema({
  id: { type: Number },
  phoneNumber: { type: String },
  companyName: { type: String, unique: true },
  address: { type: String },
  city: { type: String },
  site: { type: String },
  search: { type: String },
  tags: { type: String },
  hours: { type: String },
});

export default mongoose.model<TwogisModelInterface>('Twogis', TwogisSchema);
