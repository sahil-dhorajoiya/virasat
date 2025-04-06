import mongoose, { Schema, Document } from 'mongoose';

export interface IMaintenance extends Document {
  productId: mongoose.Types.ObjectId;
  type: 'washing' | 'repair' | 'other';
  washDate: Date;
  returnDate?: Date;
  charges: number;
  status: 'in-progress' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const WashingCharges = {
  'Pant': 40,
  'Jodhpuri Blazer': 130,
  'Blazer + Koti': 230,
  'Dupatta': 50,
  'Single Mojdi': 130
};

const MaintenanceSchema = new Schema<IMaintenance>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    type: {
      type: String,
      enum: ['washing', 'repair', 'other'],
      required: true
    },
    washDate: { type: Date, required: true },
    returnDate: { type: Date },
    charges: { type: Number, required: true },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress'
    },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Maintenance || mongoose.model<IMaintenance>('Maintenance', MaintenanceSchema); 