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
    addMonths,
    subMonths,
} from "date-fns";

export function MonthViewCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

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
        <div className="p-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className="text-gray-500 hover:text-black"
                >
                    ← Mês anterior
                </button>
                <h2 className="text-xl font-bold">
                    {format(currentDate, "MMMM yyyy", { locale: undefined })}
                </h2>
                <button
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className="text-gray-500 hover:text-black"
                >
                    Próximo mês →
                </button>
            </div>

            <div className="grid grid-cols-7 text-center font-medium text-gray-600">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                    (day) => (
                        <div key={day}>{day}</div>
                    )
                )}
            </div>

            {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7">
                    {week.map((date, di) => (
                        <div
                            key={di}
                            className={`h-24 p-2 border text-sm flex flex-col items-start ${
                                isSameMonth(date, currentDate)
                                    ? "bg-white"
                                    : "bg-gray-100 text-gray-400"
                            } ${
                                isSameDay(date, new Date())
                                    ? "border-blue-500"
                                    : ""
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
