"use client";

import { addMonths, subMonths, isSameMonth, startOfMonth } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { BodyMonthViewCalendar } from "./body-month-view-calendar";
import { HeaderMonthViewCalendar } from "./header-month-view-calendar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useEventsContext } from "@/context/EventsContext";
import { Button } from "@mui/material";

// const MAX_MONTHS = 5;

export function MonthViewCalendar() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const currentMonthRef = useRef<HTMLDivElement>(null);

    const [months, setMonths] = useState<Date[]>(() => {
        const current = startOfMonth(new Date());
        return [subMonths(current, 1), current, addMonths(current, 1)];
    });

    const { eventsByDate, fetchEventsForMonths, isLoadingEvents } =
        useEventsContext();

    useEffect(() => {
        if (months.length > 0) {
            fetchEventsForMonths(months);
        }
    }, [months]);

    // Faz a centralização no mês atual no carregamento
    useEffect(() => {
        if (scrollContainerRef.current && currentMonthRef.current) {
            currentMonthRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, []);

    const loadPreviousMonths = () => {
        setMonths((prev) => {
            return [
                subMonths(months[0], 3),
                subMonths(months[0], 2),
                subMonths(months[0], 1),
                ...prev,
            ];
        });
    };

    const loadLaterMonths = () => {
        setMonths((prev) => {
            return [
                ...prev,
                addMonths(months[months.length - 1], 1),
                addMonths(months[months.length - 1], 2),
                addMonths(months[months.length - 1], 3),
            ];
        });
    };

    const centerCurrentMonth = () => {
        const current = startOfMonth(new Date());

        setMonths((prev) => {
            const hasCurrent = prev.some((m) => isSameMonth(m, current));
            if (!hasCurrent) {
                return [subMonths(current, 1), current, addMonths(current, 1)];
            }
            return prev;
        });

        // Timeout para esperar o DOM atualizar com os novos meses
        setTimeout(() => {
            if (scrollContainerRef.current && currentMonthRef.current) {
                currentMonthRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 100); // pequeno delay para esperar render
    };

    return (
        <>
            <HeaderMonthViewCalendar />
            <div className="absolute flex justify-end right-0 pr-4 z-2">
                <IconButton onClick={centerCurrentMonth}>
                    <Tooltip title="Centralizar">
                        <RestartAltIcon color="secondary" />
                    </Tooltip>
                </IconButton>
            </div>

            <div
                ref={scrollContainerRef}
                className="h-full overflow-y-auto overflow-x-hidden scrollbar-hidden pb-9"
            >
                <div>
                    <Button onClick={loadPreviousMonths}>
                        Carregar mais 3 meses
                    </Button>
                </div>
                {months.map((month) => {
                    const isCurrentMonth = isSameMonth(month, new Date());
                    return (
                        <div
                            key={month.toISOString()}
                            ref={isCurrentMonth ? currentMonthRef : null}
                        >
                            <BodyMonthViewCalendar
                                currentDate={month}
                                eventsByDate={eventsByDate}
                            />
                        </div>
                    );
                })}
                <div>
                    <Button onClick={loadLaterMonths}>
                        Carregar mais 3 meses
                    </Button>
                </div>
            </div>
        </>
    );
}
