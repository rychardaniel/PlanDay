import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const eventSchema = z.object({
    title: z
        .string({
            required_error: "O título é obrigatório.",
            invalid_type_error: "O título deve ser um texto.",
        })
        .trim()
        .min(1, { message: "O título não pode estar vazio." }),
    date: z.coerce.date({
        required_error: "A data é obrigatória.",
        invalid_type_error: "Formato de data inválido.",
    }),
    description: z
        .string({
            invalid_type_error: "A descrição deve ser um texto.",
        })
        .optional(),
    typeId: z
        .string({
            required_error: "O ID do tipo é obrigatório.",
            invalid_type_error: "O ID do tipo deve ser um texto.",
        })
        .uuid({ message: "O ID do tipo deve ser um UUID válido." }),
});

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

// api/events
export async function POST(request: NextRequest) {
    let bodyData;
    try {
        bodyData = await request.json();
    } catch (error) {
        return NextResponse.json(
            { error: "Corpo da requisição inválido. Esperado um JSON." },
            { status: 400 }
        );
    }

    const validationResult = eventSchema.safeParse(bodyData);

    if (!validationResult.success) {
        // Formata os erros para serem mais amigáveis
        const errors = validationResult.error.flatten().fieldErrors;
        return NextResponse.json(
            {
                message: "Erro de validação.",
                errors, // Envia os erros detalhados por campo
            },
            { status: 400 } // Código 400 para Bad Request
        );
    }

    // Se a validação for bem-sucedida, validationResult.data contém os dados tipados
    const { title, date, description, typeId } = validationResult.data;

    try {
        const newEvent = await prisma.event.create({
            data: {
                title,
                date,
                description,
                typeId,
            },
        });

        return NextResponse.json(newEvent, { status: 201 }); // Retorna o evento criado com status 201
    } catch (error) {
        console.error("Erro ao criar evento:", error);

        // Verifica se o erro é devido a uma typeId não existente
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2003") {
                // Foreign key constraint failed
                return NextResponse.json(
                    { error: `O tipo com ID '${typeId}' não existe.` },
                    { status: 400 }
                );
            }
        }
    }
    return NextResponse.json(
        { error: "Ocorreu um erro ao criar o evento." },
        { status: 500 }
    );
}
