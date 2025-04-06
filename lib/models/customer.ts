import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  phone: string;
  email?: string;
  address: string;
  idProofUrl?: string;
  rentals: Array<{
    orderId: mongoose.Types.ObjectId;
    status: 'active' | 'returned' | 'overdue';
  }>;
  deposits: Array<{
    amount: number;
    status: 'held' | 'refunded' | 'deducted';
    orderId: mongoose.Types.ObjectId;
    refundDate?: Date;
  }>;
  faultCharges: Array<{
    amount: number;
    description: string;
    orderId: mongoose.Types.ObjectId;
    date: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    address: { type: String, required: true },
    idProofUrl: { type: String },
    rentals: [{
      orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
      status: {
        type: String,
        enum: ['active', 'returned', 'overdue'],
        default: 'active'
      }
    }],
    deposits: [{
      amount: { type: Number, required: true },
      status: {
        type: String,
        enum: ['held', 'refunded', 'deducted'],
        default: 'held'
      },
      orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
      refundDate: { type: Date }
    }],
    faultCharges: [{
      amount: { type: Number, required: true },
      description: { type: String, required: true },
      orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
      date: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema); 