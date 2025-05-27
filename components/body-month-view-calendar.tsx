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

    // Define a data atual apenas no cliente, evitando problemas com fuso horário
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

                        return (
                            <div
                                key={di}
                                className={`h-18 text-sm flex flex-col justify-end relative pb-6 ${
                                    isSameMonth(date, currentDate)
                                        ? "bg-fundo-claro-2 dark:bg-fundo-escuro-2 border"
                                        : ""
                                } ${
                                    isSameDay(date, clientDate!)
                                        ? "border-icone-claro dark:border-icone-escuro border-3 text-icone-claro dark:text-icone-escuro font-semibold"
                                        : "border-fundo-claro-1 dark:border-fundo-escuro-1 border-2 font-normal"
                                }`}
                            >
                                <span className="absolute pr-1 bottom-0 right-0">
                                    {isSameMonth(date, currentDate)
                                        ? format(date, "d")
                                        : ""}
                                </span>
                                {events.map((ev) => {
                                    const type = eventTypes.types.find(
                                        (type) => type.id === ev.typeId
                                    );

                                    const colorEvent = type?.color;
                                    const nameEvent = type?.name;

                                    return (
                                        <div
                                            key={ev.id}
                                            className={`w-full h-full text-xs truncate flex justify-center items-center text-black dark:text-white font-normal`}
                                            title={ev.title}
                                            style={{
                                                backgroundColor:
                                                    colorEvent?.toString(),
                                            }}
                                        >
                                            {nameEvent}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
