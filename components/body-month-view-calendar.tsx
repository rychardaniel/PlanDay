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
import Tooltip from "@mui/material/Tooltip";
import { DrawerEventsDay } from "./drawer-events-day";
import { useEventTypes } from "@/context/EventTypesContext";

type Props = {
    currentDate: Date;
    eventsByDate: EventsByDate;
};

export function BodyMonthViewCalendar({ currentDate, eventsByDate }: Props) {
    const {
        eventTypes: eventTypesData,
        isLoading: isLoadingTypes,
        error: typesError,
    } = useEventTypes();

    const [clientDate, setClientDate] = useState<Date | null>(null);
    const [selectedDateForDrawer, setSelectedDateForDrawer] =
        useState<Date | null>(currentDate);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleOpenDrawer = (date: Date) => {
        setSelectedDateForDrawer(date);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
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
        0: "h-[90%]",
        1: "h-[70%]",
        2: "h-[50%]",
    };

    const eventsForSelectedDateInDrawer = selectedDateForDrawer
        ? eventsByDate[format(selectedDateForDrawer, "yyyy-MM-dd")] || []
        : [];

    return (
        <div>
            <div className="flex flex-col items-center justify-center gap-2">
                <hr className="w-full border-fundo-claro-2 dark:border-fundo-especial border-[1.5px] mt-4" />
                <div className="flex gap-1">
                    <h2 className="text-sm sm:text-xl font-nornal capitalize">
                        {format(currentDate, "MMMM", { locale: ptBR })}
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
                                onClick={
                                    isMonth
                                        ? () => handleOpenDrawer(date)
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
                                        const type = eventTypesData.types.find(
                                            (type) => type.id === ev.typeId
                                        );

                                        const colorEvent = type?.color;
                                        const height =
                                            eventHeightClasses[index];

                                        return (
                                            <Tooltip
                                                title={ev.title}
                                                arrow
                                                key={ev.id}
                                            >
                                                <div
                                                    className={`${height} bottom-0 rounded-t-[30px] w-full absolute text-xs truncate flex justify-center items-center text-black dark:text-white font-normal`}
                                                    style={{
                                                        backgroundColor:
                                                            colorEvent?.toString(),
                                                    }}
                                                ></div>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
            {selectedDateForDrawer && (
                <DrawerEventsDay
                    open={isDrawerOpen}
                    handleClose={handleCloseDrawer}
                    selectedDate={selectedDateForDrawer}
                    events={eventsForSelectedDateInDrawer}
                />
            )}
        </div>
    );
}
