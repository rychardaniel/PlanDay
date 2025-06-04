"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

// 1. Definir a interface para os tipos de evento e o estado de carregamento
//    (Reutilizando tipos de project/interfaces/Event.ts)
interface EventTypesContextProps {
    eventTypes: EventTypes; // EventTypes é { types: EventType[] }
    isLoading: boolean;
    error: Error | null;
}

// 2. Criar o Context com um valor padrão
//    O valor padrão deve corresponder à estrutura de EventTypesContextProps
const EventTypesContext = createContext<EventTypesContextProps>({
    eventTypes: { types: [] }, // Valor inicial para eventTypes
    isLoading: true, // Começa como true, pois estaremos carregando os dados
    error: null,
});

// 3. Criar o Provedor do Contexto
export const EventTypesProvider = ({ children }: { children: ReactNode }) => {
    const [eventTypesData, setEventTypesData] = useState<EventTypes>({
        types: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Função para buscar os tipos de evento
        const fetchEventTypes = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/events/types"); // Endpoint da API
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch event types: ${response.statusText}`
                    );
                }
                const data: EventTypeResponse = await response.json(); // EventTypeResponse é { types: EventType[] }
                setEventTypesData(data);
            } catch (e) {
                if (e instanceof Error) {
                    console.error("Error fetching event types:", e);
                    setError(e);
                } else {
                    console.error("An unknown error occurred:", e);
                    setError(
                        new Error(
                            "An unknown error occurred while fetching event types"
                        )
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventTypes();
    }, []); // Array de dependências vazio para executar apenas na montagem do provedor

    return (
        <EventTypesContext.Provider
            value={{ eventTypes: eventTypesData, isLoading, error }}
        >
            {children}
        </EventTypesContext.Provider>
    );
};

// 4. Criar um hook customizado para facilitar o uso do Contexto
export const useEventTypes = () => {
    const context = useContext(EventTypesContext);
    if (context === undefined) {
        throw new Error(
            "useEventTypes must be used within an EventTypesProvider"
        );
    }
    return context;
};
