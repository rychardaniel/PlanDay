type EventItem = {
    id: string;
    title: string;
    date: string;
    description: string;
    materials: string;
    typeId: string;
    created_at: string;
};

type EventsResponse = {
    events: EventItem[];
};

type EventPayload = {
    title: string;
    date: string;
    description: string;
    materials: string;
    typeId: string;
};

type EventType = {
    id: string;
    name: string;
    color: string;
    status: number;
    created_at: string;
};

type EventTypeResponse = {
    types: EventType[];
};

type EventsByDate = { [dateKey: string]: EventItem[] };
type EventTypes = { types: EventType[] };
