import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cachedMongoose = global.mongoose;
let cachedMongoClient = global.mongoClient;

if (!cachedMongoose) {
  cachedMongoose = global.mongoose = { conn: null, promise: null };
}

if (!cachedMongoClient) {
  cachedMongoClient = global.mongoClient = { conn: null, promise: null };
}

const uri: string = process.env.MONGODB_URI!;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// ✅ Function to connect Mongoose
export async function ConnectDB() {
  if (cachedMongoose.conn) {
    return cachedMongoose.conn;
  }

  if (!cachedMongoose.promise) {
    cachedMongoose.promise = mongoose.connect(uri, {
      bufferCommands: false,
    }).then(mongoose => mongoose.connection);
  }

  try {
    cachedMongoose.conn = await cachedMongoose.promise;
    if (cachedMongoose.conn.readyState === 1) {
      return Promise.resolve(cachedMongoose.conn);
    }
  } catch (error) {
    cachedMongoose.promise = null;
    throw error;
  }

  return cachedMongoose.conn;
}

// ✅ Function to connect MongoClient (For NextAuth)
export async function getMongoClient() {
  if (cachedMongoClient.conn) {
    return cachedMongoClient.conn;
  }

  if (!cachedMongoClient.promise) {
    cachedMongoClient.promise = new MongoClient(uri, {}).connect();
  }

  try {
    cachedMongoClient.conn = await cachedMongoClient.promise;
  } catch (error) {
    cachedMongoClient.promise = null;
    throw error;
  }

  return cachedMongoClient.conn;
}
