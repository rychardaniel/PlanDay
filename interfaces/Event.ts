type EventItem = {
    id: string;
    title: string;
    date: string;
    description: string;
    typeId: string;
    created_at: string;
};

type EventsResponse = {
    events: EventItem[];
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
