import { endOfMonth, format, startOfMonth, parseISO } from "date-fns";
import { useEffect, useState } from "react";

export function useEvents(displayedMonths: Date[]) {
    const [eventsByDate, setEventsByDate] = useState<EventsByDate>({});
    const [fetchedMonthKeys, setFetchedMonthKeys] = useState<Set<string>>(
        new Set()
    );

    useEffect(() => {
        const newMonthsToFetch: Date[] = [];

        for (const monthDate of displayedMonths) {
            const monthKey = format(monthDate, "yyyy-MM");
            if (!fetchedMonthKeys.has(monthKey)) {
                newMonthsToFetch.push(monthDate);
            }
        }

        if (newMonthsToFetch.length === 0) {
            return;
        }

        newMonthsToFetch.forEach((monthToFetch) => {
            const monthKey = format(monthToFetch, "yyyy-MM");
            const startDate = format(startOfMonth(monthToFetch), "yyyy-MM-dd");
            const endDate = format(endOfMonth(monthToFetch), "yyyy-MM-dd");

            fetch(`/api/events?start=${startDate}&end=${endDate}`)
                .then((r) => r.json())
                .then((data: EventsResponse) => {
                    setEventsByDate((prevEvents) => {
                        const updatedEvents = { ...prevEvents };
                        data.events.forEach((ev) => {
                            const eventDateObject = parseISO(ev.date);
                            const eventDateKey = format(
                                eventDateObject,
                                "yyyy-MM-dd"
                            );

                            if (!updatedEvents[eventDateKey]) {
                                updatedEvents[eventDateKey] = [];
                            }
                            if (
                                !updatedEvents[eventDateKey].some(
                                    (existingEvent) =>
                                        existingEvent.id === ev.id
                                )
                            ) {
                                updatedEvents[eventDateKey].push(ev);
                            }
                        });
                        return updatedEvents;
                    });

                    setFetchedMonthKeys((prevFetchedKeys) => {
                        const newKeys = new Set(prevFetchedKeys);
                        newKeys.add(monthKey);
                        return newKeys;
                    });
                })
                .catch((error) => {
                    console.error(
                        `Falha ao buscar eventos para o mês ${monthKey}:`,
                        error
                    );
                });
        });
    }, [displayedMonths, fetchedMonthKeys]);

    return eventsByDate;
}
