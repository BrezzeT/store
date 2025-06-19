import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  salePrice?: number
  category: string
  subcategory: string
  image: string
  createdAt: Date
}

const ProductSchema: Schema<IProduct> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema) 