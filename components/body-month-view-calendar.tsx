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
                    {format(currentDate, "MMMM yyyy", { locale: undefined })}
                </h2>
            </div>

            {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7">
                    {week.map((date, di) => (
                        <div
                            key={di}
                            className={`h-18 p-2 border text-sm flex flex-col items-start ${
                                isSameMonth(date, currentDate)
                                    ? "bg-zinc-800"
                                    : "bg-zinc-600"
                            } ${
                                isSameDay(date, new Date())
                                    ? "border-blue-500"
                                    : "border-zinc-950"
                            }`}
                        >
                            <span className="font-semibold">
                                {format(date, "d")}
                            </span>
                            {/* Aqui você pode renderizar eventos */}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
