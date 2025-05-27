type EventItem = {
    id: string;
    title: string;
    date: string;
    typeId: string;
    created_at: string;
};

type EventType = {
    id: String;
    name: String;
    color: String;
};

type EventsByDate = { [dateKey: string]: EventItem[] };

type EventsResponse = {
    events: EventItem[];
};
