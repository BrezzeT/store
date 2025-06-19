import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI || typeof MONGODB_URI !== 'string') {
  throw new Error('Не вказано MongoDB URI')
}

let cached = (global as any).mongoose || { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    const mongooseOptions: any = {
      bufferCommands: false,
    }
    if (process.env.MONGODB_DB) {
      mongooseOptions.dbName = process.env.MONGODB_DB
    }
    cached.promise = mongoose.connect(MONGODB_URI!, mongooseOptions).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

if (typeof global !== 'undefined') {
  (global as any).mongoose = cached
} 