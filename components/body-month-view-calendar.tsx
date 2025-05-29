"use client";

import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    format,
    isSameMonth,
    isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { ModalAddEvent } from "./modal-add-event";

type Props = {
    currentDate: Date;
    eventsByDate: EventsByDate;
    eventTypes: EventTypes;
};

export function BodyMonthViewCalendar({
    currentDate,
    eventsByDate,
    eventTypes,
}: Props) {
    const [clientDate, setClientDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDateForModal, setSelectedDateForModal] =
        useState<Date | null>(null);

    const handleOpenModal = (date: Date) => {
        setSelectedDateForModal(date);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDateForModal(null);
    };

    useEffect(() => {
        setClientDate(new Date());
    }, []);

    const startDate = startOfWeek(startOfMonth(currentDate), {
        weekStartsOn: 0,
    });
    const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });

    const weeks = [];
    let day = startDate;

    while (day <= endDate) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            week.push(day);
            day = addDays(day, 1);
        }
        weeks.push(week);
    }

    const eventHeightClasses: Record<number, string> = {
        0: "h-9/10",
        1: "h-7/10",
        2: "h-5/10",
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center gap-2">
                <hr className="w-full border-fundo-claro-2 dark:border-fundo-especial border-[1.5px] mt-4" />
                <div className="flex gap-1">
                    <h2 className="text-sm sm:text-xl font-nornal">
                        {format(currentDate, "MMMM", { locale: ptBR })
                            .toLowerCase()
                            .replace(/(^|\s)\S/g, (match) =>
                                match.toUpperCase()
                            )}
                    </h2>
                    <h2 className="text-sm sm:text-xl font-extralight">
                        {format(currentDate, "yyyy")}
                    </h2>
                </div>
                <hr className="w-full border-fundo-claro-2 dark:border-fundo-especial border-[1.5px] mb-2" />
            </div>

            {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7">
                    {week.map((date, di) => {
                        const key = format(date, "yyyy-MM-dd");
                        const events = eventsByDate[key] || [];

                        const isToday = isSameDay(date, clientDate!);
                        const isMonth = isSameMonth(date, currentDate);

                        return (
                            <div
                                key={di}
                                onDoubleClick={
                                    isMonth
                                        ? () => handleOpenModal(date)
                                        : () => {}
                                }
                                className={`h-18 text-sm flex flex-col justify-between relative ${
                                    isMonth
                                        ? "bg-fundo-claro-2 dark:bg-fundo-escuro-2 border"
                                        : ""
                                } ${
                                    isToday
                                        ? "border-icone-claro dark:border-icone-escuro border-3 text-icone-claro dark:text-icone-escuro font-semibold"
                                        : "border-fundo-claro-1 dark:border-fundo-escuro-1 border-2 font-normal"
                                }`}
                            >
                                <span className="h-auto w-auto absolute bottom-0 right-1 z-1 text-sm sm:text-lg sm:mr-1">
                                    {isMonth ? format(date, "d") : ""}
                                </span>
                                <div className="flex flex-col h-full relative">
                                    {events.slice(0, 3).map((ev, index) => {
                                        const type = eventTypes.types.find(
                                            (type) => type.id === ev.typeId
                                        );

                                        const colorEvent = type?.color;
                                        const height =
                                            eventHeightClasses[index];

                                        return (
                                            <div
                                                key={ev.id}
                                                className={`${height} bottom-0 rounded-t-[30px] w-full absolute text-xs truncate flex justify-center items-center text-black dark:text-white font-normal`}
                                                title={ev.title}
                                                style={{
                                                    backgroundColor:
                                                        colorEvent?.toString(),
                                                }}
                                            ></div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
            {selectedDateForModal && (
                <ModalAddEvent
                    open={isModalOpen}
                    handleClose={handleCloseModal}
                    selectedDate={selectedDateForModal}
                />
            )}
        </div>
    );
}
