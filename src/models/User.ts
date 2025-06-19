import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  role: 'user' | 'admin'
  createdAt: Date
  bonusPoints?: number
  quests?: { [questId: string]: boolean }
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  bonusPoints: { type: Number, default: 0 },
  quests: { type: Schema.Types.Mixed, default: {} },
})

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema) 