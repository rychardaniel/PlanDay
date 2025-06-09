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

type eventPayload = {
    title: string;
    date: string;
    description: string;
    typeId: string;
};

type EventType = {
    id: String;
    name: String;
    color: String;
};

type EventTypeResponse = {
    types: EventType[];
};

type EventsByDate = { [dateKey: string]: EventItem[] };
type EventTypes = { types: EventType[] };
