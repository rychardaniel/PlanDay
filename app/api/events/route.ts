import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const eventsQuerySchema = z
    .object({
        start: z.coerce.date({
            required_error:
                "O parâmetro 'start' (data de início) é obrigatório.",
            invalid_type_error:
                "Formato de data inválido para 'start'. Use YYYY-MM-DD.",
        }),
        end: z.coerce.date({
            required_error: "O parâmetro 'end' (data de fim) é obrigatório.",
            invalid_type_error:
                "Formato de data inválido para 'end'. Use YYYY-MM-DD.",
        }),
    })
    .refine((data) => data.end >= data.start, {
        message:
            "A data final (end) deve ser maior ou igual à data inicial (start).",
        path: ["end"],
    });

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

// GET api/events?start=2025-05-01&end=2025-05-31
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const queryParamsToValidate = {
        start: searchParams.get("start"),
        end: searchParams.get("end"),
    };

    const validationResult = eventsQuerySchema.safeParse(queryParamsToValidate);

    if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;

        let errorMessages: string[] = [];

        if (errors.start) errorMessages = errorMessages.concat(errors.start);
        if (errors.end) errorMessages = errorMessages.concat(errors.end);
        if (validationResult.error.flatten().formErrors.length > 0) {
            errorMessages = errorMessages.concat(
                validationResult.error.flatten().formErrors
            );
        }

        return NextResponse.json(
            {
                message: "Erro de validação nos parâmetros da query.",
                errors:
                    errorMessages.length > 0
                        ? errorMessages.join("; ")
                        : "Parâmetros de data inválidos ou ausentes.",
                detailed_errors: validationResult.error.flatten(),
            },
            { status: 400 }
        );
    }

    const { start: validatedStartDate, end: validatedEndDate } =
        validationResult.data;

    try {
        const startDateUTC = new Date(
            Date.UTC(
                validatedStartDate.getUTCFullYear(),
                validatedStartDate.getUTCMonth(),
                validatedStartDate.getUTCDate(),
                0,
                0,
                0,
                0
            )
        );

        const endDateQueryLimitUTC = new Date(
            Date.UTC(
                validatedEndDate.getUTCFullYear(),
                validatedEndDate.getUTCMonth(),
                validatedEndDate.getUTCDate() + 1,
                0,
                0,
                0,
                0
            )
        );

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

        return NextResponse.json(
            { error: "Ocorreu um erro ao buscar os eventos." },
            { status: 500 }
        );
    }
}

// POST api/events
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
        const errors = validationResult.error.flatten().fieldErrors;
        return NextResponse.json(
            {
                message: "Erro de validação.",
                errors,
            },
            { status: 400 }
        );
    }

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

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar evento:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2003") {
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
