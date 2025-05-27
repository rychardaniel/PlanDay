import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

// api/events?start=2025-05-01&end=2025-05-31
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const startDateString = searchParams.get("start"); // Formato "YYYY-MM-DD", ex: "2025-05-01"
    const endDateString = searchParams.get("end"); // Formato "YYYY-MM-DD", ex: "2025-05-31"

    if (!startDateString || !endDateString) {
        return NextResponse.json(
            { error: "Os parâmetros startDate e endDate são obrigatórios." },
            { status: 400 }
        );
    }

    try {
        const startYear = parseInt(startDateString.substring(0, 4), 10);
        const startMonth = parseInt(startDateString.substring(5, 7), 10) - 1;
        const startDay = parseInt(startDateString.substring(8, 10), 10);
        const startDateUTC = new Date(
            Date.UTC(startYear, startMonth, startDay, 0, 0, 0, 0)
        );

        const endYear = parseInt(endDateString.substring(0, 4), 10);
        const endMonth = parseInt(endDateString.substring(5, 7), 10) - 1;
        const endDay = parseInt(endDateString.substring(8, 10), 10);
        const endDateQueryLimitUTC = new Date(
            Date.UTC(endYear, endMonth, endDay + 1, 0, 0, 0, 0)
        );

        if (
            isNaN(startDateUTC.getTime()) ||
            isNaN(endDateQueryLimitUTC.getTime())
        ) {
            return NextResponse.json(
                { error: "Formato de data inválido fornecido." },
                { status: 400 }
            );
        }

        const events = await prisma.event.findMany({
            where: {
                date: {
                    gte: startDateUTC,
                    lt: endDateQueryLimitUTC,
                },
            },
            orderBy: {
                date: "asc",
            },
        });

        return NextResponse.json({ events });
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);

        if (
            error instanceof Error &&
            (error.message.includes("Invalid date") ||
                error.message.includes("Argument type error"))
        ) {
            return NextResponse.json(
                { error: "Parâmetros de data inválidos." },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Ocorreu um erro ao buscar os eventos." },
            { status: 500 }
        );
    }
}
