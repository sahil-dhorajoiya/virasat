import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  productCode: string;
  category: string;
  size: string;
  availableStock: number;
  imageUrl: string;
  rentPrice: number;
  salePrice: number;
  deposit: number;
  damagePolicy: string;
  isEligibleForBuyback: boolean;
  description?: string;
  translations?: {
    hi?: {
      name: string;
      description: string;
      damagePolicy: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    productCode: { type: String, required: true, unique: true },
    category: {
      type: String,
      required: true,
      enum: ['Blazer', 'Jodhpuri', 'Indo Western', 'Sherwani', 'Kurta Pajama', 'Mojdi', 'Accessories'],
    },
    size: { type: String, required: true },
    availableStock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, required: true },
    rentPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    deposit: { type: Number, required: true },
    damagePolicy: { type: String, required: true },
    isEligibleForBuyback: { type: Boolean, default: false },
    description: { type: String },
    translations: {
      hi: {
        name: { type: String },
        description: { type: String },
        damagePolicy: { type: String },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 