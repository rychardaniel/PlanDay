import { useEffect, useState } from "react";

export function useEventsTypes() {
    const [eventTypes, setEventTypes] = useState<EventTypes>({ types: [] });

    useEffect(() => {
        fetch("/api/events/types")
            .then((r) => r.json())
            .then((data: EventTypeResponse) => setEventTypes(data));
    }, []);

    return eventTypes;
}
