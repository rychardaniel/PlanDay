import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    console.log("start: ", startDate, "end", endDate);

    return NextResponse.json({
        events: [
            { id: 1, title: "Evento 1", date: "2025-05-15" },
            { id: 2, title: "Evento 2", date: "2025-05-26" },
        ],
    });
}
