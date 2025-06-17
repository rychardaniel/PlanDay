import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

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

// PUT /api/events/types/[typeId]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ typeId: string }> }
) {
    const { typeId } = await params;

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
        const updatedEventType = await prisma.eventType.update({
            where: {
                id: typeId,
            },
            data: {
                name,
                color,
            },
        });

        return NextResponse.json(updatedEventType, { status: 200 });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: `Tipo de evento com ID ${typeId} não encontrado.` },
                { status: 404 }
            );
        }
        console.error("Erro ao atualizar o tipo de evento:", error);
        return NextResponse.json(
            { error: "Ocorreu um erro ao atualizar o tipo de evento." },
            { status: 500 }
        );
    }
}

// DELETE /api/events/types/[typeId]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ typeId: string }> }
) {
    const { typeId } = await params;

    try {
        await prisma.eventType.delete({
            where: {
                id: typeId,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: `Tipo de evento com ID ${typeId} não encontrado.` },
                { status: 404 }
            );
        }
        console.error("Erro ao deletar o tipo de evento:", error);
        return NextResponse.json(
            { error: "Ocorreu um erro ao deletar o tipo de evento." },
            { status: 500 }
        );
    }
}
