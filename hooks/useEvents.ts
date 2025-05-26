import { endOfMonth, format, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";

export function useEvents(displayedMonths: Date[]) {
    const [eventsByDate, setEvents] = useState<EventsByDate>({});
    const [fetchedRanges, setFetchedRanges] = useState<
        { start: string; end: string }[]
    >([]);

    useEffect(() => {
        const sorted = displayedMonths
            .map((d) => format(startOfMonth(d), "yyyy-MM-01"))
            .sort();
        const start = sorted[0];
        const end = format(
            endOfMonth(displayedMonths[displayedMonths.length - 1]),
            "yyyy-MM-dd"
        );
        // checar se esse range já foi buscado
        if (!fetchedRanges.some((r) => r.start === start && r.end === end)) {
            fetch(`/api/events?start=${start}&end=${end}`)
                .then((r) => r.json())
                .then((data: EventsResponse) => {
                    const updated = { ...eventsByDate };
                    data.events.forEach((ev) => {
                        const key = ev.date;
                        if (!updated[key]) {
                            updated[key] = [];
                        }
                        // Verifica se um evento com o mesmo ID já existe para esta data
                        if (
                            !updated[key].some(
                                (existingEvent) => existingEvent.id === ev.id
                            )
                        ) {
                            updated[key].push(ev);
                        }
                    });
                    setEvents(updated);
                    setFetchedRanges((ranges) => [...ranges, { start, end }]);
                });
        }
    }, [displayedMonths]);

    return eventsByDate;
}
