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
