"use client";

import { addMonths, subMonths, isSameMonth, startOfMonth } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { BodyMonthViewCalendar } from "./body-month-view-calendar";
import { HeaderMounthViewCalendar } from "./header-month-view-calendar";
import { IconButton, Tooltip } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useEvents } from "@/hooks/useEvents";
import { useEventsTypes } from "@/hooks/useEventsTypes";

const MAX_MONTHS = 5;

export function MonthViewCalendar() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const currentMonthRef = useRef<HTMLDivElement>(null);

    const [months, setMonths] = useState<Date[]>(() => {
        const current = startOfMonth(new Date());
        return [subMonths(current, 1), current, addMonths(current, 1)];
    });

    const eventsByDate = useEvents(months);
    const eventTypes = useEventsTypes();

    useEffect(() => {
        if (scrollContainerRef.current && currentMonthRef.current) {
            const container = scrollContainerRef.current;
            const target = currentMonthRef.current;

            container.scrollTop = target.offsetTop - container.offsetTop;
        }
    }, []);

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const threshold = 300;
        const atTop = container.scrollTop < threshold;
        const atBottom =
            container.scrollHeight -
                container.scrollTop -
                container.clientHeight <
            threshold;

        if (atTop) {
            setMonths((prev) => {
                const first = prev[0];
                const newMonth = subMonths(first, 1);
                if (prev.some((m) => isSameMonth(m, newMonth))) return prev;

                const updated = [newMonth, ...prev];
                return updated.length > MAX_MONTHS
                    ? updated.slice(0, MAX_MONTHS)
                    : updated;
            });
        }

        if (atBottom) {
            setMonths((prev) => {
                const last = prev[prev.length - 1];
                const newMonth = addMonths(last, 1);
                if (prev.some((m) => isSameMonth(m, newMonth))) return prev;

                const updated = [...prev, newMonth];
                return updated.length > MAX_MONTHS
                    ? updated.slice(-MAX_MONTHS)
                    : updated;
            });
        }
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
                const container = scrollContainerRef.current;
                const target = currentMonthRef.current;

                container.scrollTop = target.offsetTop - container.offsetTop;
            }
        }, 100); // pequeno delay para esperar render
    };

    return (
        <>
            <HeaderMounthViewCalendar />
            <div className="absolute flex justify-end right-0 pr-4 z-1">
                <IconButton onClick={centerCurrentMonth}>
                    <Tooltip title="Centralizar">
                        <RestartAltIcon color="secondary" />
                    </Tooltip>
                </IconButton>
            </div>

            <div
                ref={scrollContainerRef}
                className="h-full overflow-y-auto overflow-x-hidden scrollbar-hidden pb-9"
                onScroll={handleScroll}
            >
                {months.map((month, index) => {
                    const isCurrentMonth = isSameMonth(month, new Date());
                    return (
                        <div
                            key={month.toISOString()}
                            ref={isCurrentMonth ? currentMonthRef : null}
                        >
                            <BodyMonthViewCalendar
                                currentDate={month}
                                eventsByDate={eventsByDate}
                                eventTypes={eventTypes}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
