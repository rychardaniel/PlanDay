-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "typeId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "event_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
