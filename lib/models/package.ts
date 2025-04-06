import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  description: string;
  items: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
  }>;
  totalRentPrice: number;
  totalSalePrice: number;
  deposit: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  translations?: {
    hi?: {
      name: string;
      description: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 }
    }],
    totalRentPrice: { type: Number, required: true },
    totalSalePrice: { type: Number, required: true },
    deposit: { type: Number, required: true },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    discountValue: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    translations: {
      hi: {
        name: { type: String },
        description: { type: String }
      }
    }
  },
  { timestamps: true }
);

export default mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema); 