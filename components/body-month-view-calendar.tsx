"use client";

import { useState } from "react";
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

type Props = {
    currentDate: Date;
};

export function BodyMonthViewCalendar({ currentDate }: Props) {
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
            <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-xl font-bold mt-4">
                    {format(currentDate, "MMMM yyyy", { locale: ptBR })
                        .toLowerCase()
                        .replace(/(^|\s)\S/g, (match) => match.toUpperCase())}
                </h2>
            </div>

            {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7">
                    {week.map((date, di) => (
                        <div
                            key={di}
                            className={`h-18 p-2 text-sm flex flex-col items-start ${
                                isSameMonth(date, currentDate)
                                    ? "bg-zinc-200 dark:bg-zinc-800 border"
                                    : ""
                            } ${
                                isSameDay(date, new Date())
                                    ? "border-blue-500 border-2 dark:border"
                                    : "border-white dark:border-zinc-950"
                            }`}
                        >
                            {isSameMonth(date, currentDate) ? (
                                <span className="font-semibold">
                                    {format(date, "d")}
                                </span>
                            ) : (
                                <></>
                            )}
                            {/* Aqui você pode renderizar eventos */}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
