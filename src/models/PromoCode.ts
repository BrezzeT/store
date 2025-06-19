import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPromoCode extends Document {
  code: string
  discountType: 'percent' | 'amount'
  discountValue: number
  expiresAt?: Date
  usageLimit?: number
  usedCount?: number
}

const PromoCodeSchema: Schema<IPromoCode> = new Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percent', 'amount'], required: true },
  discountValue: { type: Number, required: true },
  expiresAt: { type: Date },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
})

export const PromoCode: Model<IPromoCode> = mongoose.models.PromoCode || mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema) 