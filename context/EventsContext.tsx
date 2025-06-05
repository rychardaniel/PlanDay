"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    SetStateAction,
    Dispatch,
} from "react";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

interface EventsContextProps {
    eventsByDate: EventsByDate;
    isLoadingEvents: boolean; // Opcional: para estado de carregamento durante as buscas
    fetchEventsForMonths: (monthsToLoad: Date[]) => Promise<void>;
    refreshMonthOfEvent: (newEvent: EventItem) => void;
    setEventsByDate: Dispatch<SetStateAction<EventsByDate>>; // Permite manipulação direta se necessário
}

const EventsContext = createContext<EventsContextProps | undefined>(undefined);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
    const [eventsByDate, setEventsByDate] = useState<EventsByDate>({});
    const [fetchedMonthKeys, setFetchedMonthKeys] = useState<Set<string>>(
        new Set()
    );
    const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);

    const fetchEventsForMonths = useCallback(
        async (monthsToLoad: Date[]) => {
            const newMonthsToFetch: Date[] = [];
            for (const monthDate of monthsToLoad) {
                const monthKey = format(monthDate, "yyyy-MM");
                if (!fetchedMonthKeys.has(monthKey)) {
                    newMonthsToFetch.push(monthDate);
                }
            }

            if (newMonthsToFetch.length === 0) {
                return;
            }

            setIsLoadingEvents(true);

            try {
                for (const monthToFetch of newMonthsToFetch) {
                    const monthKey = format(monthToFetch, "yyyy-MM");
                    const startDate = format(
                        startOfMonth(monthToFetch),
                        "yyyy-MM-dd"
                    );
                    const endDate = format(
                        endOfMonth(monthToFetch),
                        "yyyy-MM-dd"
                    );

                    const response = await fetch(
                        `/api/events?start=${startDate}&end=${endDate}`
                    );
                    if (!response.ok) {
                        throw new Error(
                            `Falha ao buscar eventos para ${monthKey}`
                        );
                    }
                    const data: EventsResponse = await response.json();

                    setEventsByDate((prevEvents) => {
                        const updatedEvents = { ...prevEvents };
                        data.events.forEach((ev) => {
                            const eventDateKey = formatInTimeZone(
                                ev.date,
                                "Etc/UTC", // Garanta que o fuso horário seja consistente com o backend
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
                                // Opcional: ordene os eventos se necessário após adicionar
                                // updatedEvents[eventDateKey].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                            }
                        });
                        return updatedEvents;
                    });

                    setFetchedMonthKeys((prevFetchedKeys) => {
                        const newKeys = new Set(prevFetchedKeys);
                        newKeys.add(monthKey);
                        return newKeys;
                    });
                }
            } catch (error) {
                console.error("Falha ao buscar eventos:", error);
                // Trate o erro apropriadamente, ex: defina um estado de erro
            } finally {
                setIsLoadingEvents(false); // Opcional: limpe o estado de carregamento
            }
        },
        [fetchedMonthKeys] // A dependência é fetchedMonthKeys. setEventsByDate e setIsLoadingEvents são estáveis.
    );

    // Faz uma nova busca no mês em que os eventos mudaram
    const refreshMonthOfEvent = useCallback(
        async (newEvent: EventItem) => {
            const eventDate = new Date(newEvent.date);
            const startOfMonthDate = startOfMonth(eventDate);

            // Força o refetch do mês atual ignorando o cache
            const monthKey = format(startOfMonthDate, "yyyy-MM");

            setFetchedMonthKeys((prev) => {
                const newSet = new Set(prev);
                newSet.delete(monthKey); // Remove para forçar a busca novamente
                return newSet;
            });

            await fetchEventsForMonths([startOfMonthDate]);
        },
        [fetchEventsForMonths]
    );

    return (
        <EventsContext.Provider
            value={{
                eventsByDate,
                isLoadingEvents,
                fetchEventsForMonths,
                refreshMonthOfEvent,
                setEventsByDate,
            }}
        >
            {children}
        </EventsContext.Provider>
    );
};

export const useEventsContext = () => {
    const context = useContext(EventsContext);
    if (context === undefined) {
        throw new Error(
            "useEventsContext deve ser usado dentro de um EventsProvider"
        );
    }
    return context;
};
