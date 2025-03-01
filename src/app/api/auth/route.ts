import { NextRequest, NextResponse } from "next/server";
import AdminLoginModel from "../../../../models/admin-login";

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json()
        if (!username || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const adminUserExists = await AdminLoginModel.findOne({ username })

        if (!adminUserExists) {
            return NextResponse.json({ error: "Invalid username" }, { status: 400 });
        }

        if (adminUserExists.password !== password) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "Login successful" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({error: error instanceof Error ? error.message :'Failed to login'}, {status: 500});
    }
}