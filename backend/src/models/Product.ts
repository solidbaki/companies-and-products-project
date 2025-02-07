import mongoose from "mongoose";

export interface IProduct {
  name: string;
  category: string;
  productAmount: number;
  amountUnit: string;
  company: mongoose.Schema.Types.ObjectId;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    productAmount: { type: Number, required: true },
    amountUnit: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
