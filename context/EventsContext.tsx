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
    addEventToDisplay: (newEvent: EventItem) => void;
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

            setIsLoadingEvents(true); // Opcional: definir estado de carregamento

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

    const addEventToDisplay = useCallback((newEvent: EventItem) => {
        const eventDateKey = formatInTimeZone(
            newEvent.date,
            "Etc/UTC", // Garanta que o fuso horário seja consistente
            "yyyy-MM-dd"
        );

        setEventsByDate((prevEvents) => {
            const updatedEventsOnDate = [...(prevEvents[eventDateKey] || [])];

            // Evita adicionar duplicatas se de alguma forma já existir pelo ID
            if (
                !updatedEventsOnDate.some(
                    (existingEvent) => existingEvent.id === newEvent.id
                )
            ) {
                updatedEventsOnDate.push(newEvent);
                // Opcional: ordene os eventos se a ordem importar
                // updatedEventsOnDate.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            }

            return {
                ...prevEvents,
                [eventDateKey]: updatedEventsOnDate,
            };
        });
    }, []); // Nenhuma dependência, pois usa apenas setEventsByDate e o argumento newEvent

    return (
        <EventsContext.Provider
            value={{
                eventsByDate,
                isLoadingEvents,
                fetchEventsForMonths,
                addEventToDisplay,
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
