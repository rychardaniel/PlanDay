import { endOfMonth, format, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";

export function useEvents(displayedMonths: Date[]) {
    const [eventsByDate, setEventsByDate] = useState<EventsByDate>({});
    const [fetchedMonthKeys, setFetchedMonthKeys] = useState<Set<string>>(
        new Set()
    );

    useEffect(() => {
        const newMonthsToFetch: Date[] = [];

        // Identifica os meses que ainda não foram buscados
        for (const monthDate of displayedMonths) {
            const monthKey = format(monthDate, "yyyy-MM");
            if (!fetchedMonthKeys.has(monthKey)) {
                newMonthsToFetch.push(monthDate);
            }
        }

        if (newMonthsToFetch.length === 0) {
            return; // Nenhum mês novo para buscar
        }

        // Para cada novo mês, busca os eventos
        newMonthsToFetch.forEach((monthToFetch) => {
            const monthKey = format(monthToFetch, "yyyy-MM");
            const startDate = format(startOfMonth(monthToFetch), "yyyy-MM-dd");
            const endDate = format(endOfMonth(monthToFetch), "yyyy-MM-dd");

            // console.log(`Buscando eventos para: ${monthKey} (de ${startDate} a ${endDate})`);

            fetch(`/api/events?start=${startDate}&end=${endDate}`)
                .then((r) => r.json())
                .then((data: EventsResponse) => {
                    setEventsByDate((prevEvents) => {
                        const updatedEvents = { ...prevEvents };
                        data.events.forEach((ev) => {
                            const eventDateKey = ev.date; // Assumindo que ev.date está no formato "yyyy-MM-dd"
                            if (!updatedEvents[eventDateKey]) {
                                updatedEvents[eventDateKey] = [];
                            }
                            // Adiciona o evento apenas se ele ainda não existir (verificando pelo ID)
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

                    // Adiciona o mês à lista de meses buscados APÓS o sucesso da busca
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
                    // Você pode querer adicionar uma lógica de retry ou remover o monthKey
                    // de uma tentativa de adição otimista se implementado.
                });
        });
    }, [displayedMonths, fetchedMonthKeys]); // Adicionar fetchedMonthKeys às dependências

    return eventsByDate;
}
