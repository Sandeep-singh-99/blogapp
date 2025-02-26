// import mongoose from 'mongoose'
// import { MongoClient } from 'mongodb'


// const MONGODB_URI = process.env.MONGODB_URI

// if (!MONGODB_URI) {
//     throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
// }

// let cached = global.mongoose

// if (!cached) {
//     cached = global.mongoose = { conn: null, promise: null }
// }

// const uri:string = process.env.MONGODB_URI!

// if (!uri) {
//     throw new Error(
//         'Please define the MONGODB_URI environment variable inside .env.local'
//     )
// }

// export async function ConnectDB()  {
//     if (cached.conn) {
//         return cached.conn
//     }

//     if (!cached.promise) {
//         const opts = {
//             bufferCommands: false,
//             maxPollSize: 10,
//         };
//         cached.promise = mongoose.connect(uri, opts).then((mongoose) => mongoose.connection)
//     }

//     try {
//         cached.conn = await cached.promise
//     } catch (error) {
//         cached.promise = null;
//         throw error;
//     }

//     return cached.conn
// }



import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient: MongoClient | null = null;

export async function ConnectDB(): Promise<MongoClient> {
    if (cachedClient) {
        return cachedClient;
    }

    try {
        cachedClient = new MongoClient(MONGODB_URI);
        await cachedClient.connect();
        console.log("MongoDB Connected");
        return cachedClient;
    } catch (error) {
        console.error("MongoDB Connection Failed", error);
        throw error;
    }
}
