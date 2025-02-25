import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/db";
import AdminAuthModel from "../../../../models/admin-auth";

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
        }

        await ConnectDB()

        const admiExists = await AdminAuthModel.findOne({ username });

        if (!admiExists || admiExists.password !== password) {
            return NextResponse.json({ error: "Invalid username or password" }, { status: 400 });
        }

        return NextResponse.json({ message: "Login successful" }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
}