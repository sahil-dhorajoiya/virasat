import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  orderType: 'rental' | 'sale';
  items: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    type: 'rental' | 'sale';
    rentalDuration?: {
      startDate: Date;
      endDate: Date;
    };
  }>;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';
  subtotal: number;
  discount: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  deposit: number;
  damageCharges: number;
  total: number;
  paymentStatus: 'pending' | 'partial' | 'completed';
  paymentDetails: Array<{
    amount: number;
    method: 'cash' | 'upi' | 'card';
    date: Date;
  }>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    orderType: {
      type: String,
      enum: ['rental', 'sale'],
      required: true
    },
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      type: {
        type: String,
        enum: ['rental', 'sale'],
        required: true
      },
      rentalDuration: {
        startDate: { type: Date },
        endDate: { type: Date }
      }
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'active', 'completed', 'cancelled'],
      default: 'pending'
    },
    subtotal: { type: Number, required: true },
    discount: {
      type: { type: String, enum: ['percentage', 'fixed'] },
      value: { type: Number }
    },
    deposit: { type: Number, default: 0 },
    damageCharges: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'completed'],
      default: 'pending'
    },
    paymentDetails: [{
      amount: { type: Number, required: true },
      method: {
        type: String,
        enum: ['cash', 'upi', 'card'],
        required: true
      },
      date: { type: Date, default: Date.now }
    }],
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema); 