import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { z } from "zod";

const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

const eventTypeSchema = z.object({
    name: z
        .string({
            required_error: "O nome é obrigatório.",
            invalid_type_error: "O nome deve ser um texto.",
        })
        .trim()
        .min(1, { message: "O nome não pode estar vazio." }),
    color: z.string().refine((val) => hexColorRegex.test(val), {
        message:
            "A string não é uma cor hexadecimal válida (ex: #FFF ou #FFFFFF)",
    }),
});

// GET api/events/types
export async function GET(request: NextRequest) {
    const types = await prisma.eventType.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return NextResponse.json({ types });
}

// POST api/events/types
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

    const validationResult = eventTypeSchema.safeParse(bodyData);

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

    const { name, color } = validationResult.data;

    try {
        const newEventType = await prisma.eventType.create({
            data: {
                name,
                color,
            },
        });

        return NextResponse.json(newEventType, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar o tipo de evento:", error);
    }
    return NextResponse.json(
        { error: "Ocorreu um erro ao criar o tipo de evento." },
        { status: 500 }
    );
}
