import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

// api/events/types
export async function GET(request: NextRequest) {
    const types = await prisma.eventType.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return NextResponse.json({ types });
}
