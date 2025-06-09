import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const eventIdSchema = z
    .string({
        required_error: "O ID do evento é obrigatório.",
        invalid_type_error: "O ID do evento deve ser um texto.",
    })
    .uuid({ message: "O ID do evento deve ser um UUID válido." });

const eventPayloadEdit = z.object({
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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await params;

    const parsed = eventIdSchema.safeParse(eventId);

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.errors },
            { status: 400 }
        );
    }

    const eventIdForEdit = parsed.data;

    let bodyData;

    try {
        bodyData = await request.json();
    } catch (error) {
        return NextResponse.json(
            { error: "Corpo da requisição inválido. Esperado um JSON." },
            { status: 400 }
        );
    }

    const validationResult = eventPayloadEdit.safeParse(bodyData);

    if (!validationResult.success) {
        return NextResponse.json(
            {
                message: "Erro de validação.",
                errors: validationResult.error.format(),
            },
            { status: 400 }
        );
    }

    const { title, date, description, typeId } = validationResult.data;

    try {
        await prisma.event.update({
            where: { id: eventIdForEdit },
            data: {
                title,
                date,
                description,
                typeId,
            },
        });

        // Para retorno 204 sem conteúdo
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error("Erro inesperado ao editar evento:", error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2003") {
                return NextResponse.json(
                    { error: `O tipo com ID '${typeId}' não existe.` },
                    { status: 400 }
                );
            }

            if (error.code === "P2025") {
                return NextResponse.json(
                    {
                        error: `Evento com ID '${eventIdForEdit}' não encontrado.`,
                    },
                    { status: 404 }
                );
            }
        }
    }
    return NextResponse.json(
        { error: "Ocorreu um erro ao editar o evento." },
        { status: 500 }
    );
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await params;

    const parsed = eventIdSchema.safeParse(eventId);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.errors },
            { status: 400 }
        );
    }

    const eventIdForDelete = parsed.data;

    try {
        await prisma.event.delete({
            where: { id: eventIdForDelete },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: "Evento não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "Erro ao deletar o evento" },
            { status: 500 }
        );
    }
}
