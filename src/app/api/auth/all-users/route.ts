import { NextRequest, NextResponse } from "next/server";
import { ConnectDB, getMongoClient } from "../../../../../lib/db";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    await ConnectDB();
    const client = await getMongoClient();
    const db = client.db();

    // Fetch all accounts
    const accounts = await db.collection("accounts").find().toArray();

    // Extract all userIds from accounts
    const userIds = accounts.map((account: any) => new ObjectId(account.userId)); // Convert to ObjectId

    // Fetch all users whose _id matches any userId in accounts
    const allUsers = await db.collection("users").find({ _id: { $in: userIds } }).toArray();

    return NextResponse.json({ allUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}
