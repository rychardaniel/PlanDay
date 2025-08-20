import { NextResponse } from "next/server";

export async function GET() {

    const env = process.env;

    return NextResponse.json({
        success: true,
        env: {
            DATABASE_URL: env.DATABASE_URL,
        },
    });
}
