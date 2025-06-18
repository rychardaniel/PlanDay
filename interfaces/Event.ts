type EventItem = {
    id: string;
    title: string;
    date: string;
    description: string;
    typeId: string;
    created_at: Date;
};

type EventsResponse = {
    events: EventItem[];
};

type EventPayload = {
    title: string;
    date: string;
    description: string;
    typeId: string;
};

type EventType = {
    id: string;
    name: string;
    color: string;
};

type EventTypeResponse = {
    types: EventType[];
};

type EventsByDate = { [dateKey: string]: EventItem[] };
type EventTypes = { types: EventType[] };
