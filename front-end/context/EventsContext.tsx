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
import {
    addMonths,
    addDays,
    endOfMonth,
    format,
    isBefore,
    startOfMonth,
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

interface EventsContextProps {
    eventsByDate: EventsByDate;
    isLoadingEvents: boolean;
    fetchEventsForMonths: (monthsToLoad: Date[]) => Promise<void>;
    refreshMonth: (data: Date) => void;
    setEventsByDate: Dispatch<SetStateAction<EventsByDate>>;
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
            const newMonthsToFetch = monthsToLoad.filter(
                (monthDate) =>
                    !fetchedMonthKeys.has(format(monthDate, "yyyy-MM"))
            );

            if (newMonthsToFetch.length === 0) {
                return;
            }

            setIsLoadingEvents(true);

            try {
                // 1. Encontrar o intervalo de datas geral para todos os meses a serem buscados.
                const sortedMonths = [...newMonthsToFetch].sort(
                    (a, b) => a.getTime() - b.getTime()
                );
                const overallStartDate = startOfMonth(sortedMonths[0]);
                const overallEndDate = endOfMonth(
                    sortedMonths[sortedMonths.length - 1]
                );

                const formattedStartDate = format(
                    overallStartDate,
                    "yyyy-MM-dd"
                );
                const formattedEndDate = format(overallEndDate, "yyyy-MM-dd");

                // 2. Realizar uma ÚNICA requisição para todo o intervalo.
                const response = await fetch(
                    `/api/events?start=${formattedStartDate}&end=${formattedEndDate}`
                );

                if (!response.ok) {
                    const errors = await response.json();
                    console.error(
                        `Falha ao buscar eventos de ${formattedStartDate} a ${formattedEndDate}: ${JSON.stringify(
                            errors
                        )}`
                    );
                    // Em caso de falha, saímos cedo para não atualizar os estados de forma incorreta.
                    setIsLoadingEvents(false);
                    return;
                }

                const data: EventsResponse = await response.json();
                const allNewEvents: EventsByDate = {};

                data.events.forEach((ev) => {
                    const eventDateKey = formatInTimeZone(
                        ev.date,
                        "Etc/UTC",
                        "yyyy-MM-dd"
                    );
                    if (!allNewEvents[eventDateKey]) {
                        allNewEvents[eventDateKey] = [];
                    }
                    allNewEvents[eventDateKey].push(ev);
                });

                // 3. Atualiza o estado dos eventos de uma vez.
                setEventsByDate((prevEvents) => {
                    const updatedEvents = { ...prevEvents };

                    // a. Limpa todos os eventos do intervalo de datas que foi buscado.
                    // Isso garante que eventos excluídos sejam removidos do estado.
                    let currentDateInLoop = overallStartDate;
                    while (currentDateInLoop <= overallEndDate) {
                        const dateKey = format(currentDateInLoop, "yyyy-MM-dd");
                        if (updatedEvents[dateKey]) {
                            delete updatedEvents[dateKey];
                        }
                        currentDateInLoop = addDays(currentDateInLoop, 1);
                    }

                    // b. Adiciona os novos eventos (já agrupados por data em 'allNewEvents').
                    // O spread operator garante que os novos dados sobrescrevam os antigos (que já foram limpos).
                    return { ...updatedEvents, ...allNewEvents };
                });

                // 4. Adicionar as chaves de TODOS os meses que estavam no intervalo buscado.
                setFetchedMonthKeys((prevKeys) => {
                    const newKeys = new Set(prevKeys);
                    let currentMonth = overallStartDate;
                    while (isBefore(currentMonth, overallEndDate)) {
                        const monthKey = format(currentMonth, "yyyy-MM");
                        newKeys.add(monthKey);
                        currentMonth = addMonths(currentMonth, 1);
                    }
                    return newKeys;
                });
            } catch (error) {
                console.error("Falha ao processar a busca de eventos:", error);
            } finally {
                setIsLoadingEvents(false);
            }
        },
        // A dependência 'fetchedMonthKeys' é necessária pois a função a lê diretamente
        // no filtro inicial. Isso garante que o hook seja recriado se os meses
        // já buscados mudarem.
        [fetchedMonthKeys]
    );

    const refreshMonth = useCallback(
        async (date: Date) => {
            const eventDate = new Date(date);
            const startOfMonthDate = startOfMonth(eventDate);
            const monthKey = format(startOfMonthDate, "yyyy-MM");

            setFetchedMonthKeys((prev) => {
                const newSet = new Set(prev);
                newSet.delete(monthKey);
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
                refreshMonth,
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
