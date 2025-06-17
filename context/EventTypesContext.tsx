"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
    useCallback, // ✨ Adicionado useCallback para otimização
} from "react";

// 1. Atualizar a interface do Contexto para incluir a função de update
interface EventTypesContextProps {
    eventTypes: EventTypes;
    isLoading: boolean;
    error: Error | null;
    updateEventType: (updatedType: EventType) => void; // ✨ NOVO: Função para atualizar um item
}

// 2. Atualizar o valor padrão do Contexto
const EventTypesContext = createContext<EventTypesContextProps>({
    eventTypes: { types: [] },
    isLoading: true,
    error: null,
    updateEventType: () => {}, // ✨ NOVO: Função placeholder
});

// 3. Atualizar o Provedor do Contexto
export const EventTypesProvider = ({ children }: { children: ReactNode }) => {
    const [eventTypesData, setEventTypesData] = useState<EventTypes>({
        types: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchEventTypes = async () => {
            // ... sua lógica de fetch continua a mesma
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch("/api/events/types");
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch event types: ${response.statusText}`
                    );
                }
                const data: EventTypes = await response.json();
                setEventTypesData(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e);
                } else {
                    setError(new Error("An unknown error occurred"));
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventTypes();
    }, []);

    // ✨ NOVO: Função para atualizar um tipo de evento no estado local
    const updateEventType = useCallback((updatedType: EventType) => {
        setEventTypesData((currentData) => {
            // Mapeia os tipos existentes
            const updatedTypes = currentData.types.map((type) => {
                // Se o ID corresponder, retorna o objeto atualizado
                if (type.id === updatedType.id) {
                    return updatedType;
                }
                // Caso contrário, retorna o objeto original
                return type;
            });

            // Retorna o novo estado com a lista de tipos atualizada
            return { ...currentData, types: updatedTypes };
        });
    }, []); // useCallback com dependências vazias, pois `setEventTypesData` é estável

    // ✨ NOVO: Adiciona a função `updateEventType` ao valor do provedor
    const value = {
        eventTypes: eventTypesData,
        isLoading,
        error,
        updateEventType,
    };

    return (
        <EventTypesContext.Provider value={value}>
            {children}
        </EventTypesContext.Provider>
    );
};

// 4. O hook customizado não precisa de alterações
export const useEventTypes = () => {
    const context = useContext(EventTypesContext);
    if (context === undefined) {
        throw new Error(
            "useEventTypes must be used within an EventTypesProvider"
        );
    }
    return context;
};
