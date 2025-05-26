interface Event {
    id: string;
    title: string;
    date: string; // ex: "2025-05-15"
}

type EventsByDate = Record<string, Event[]>;

type EventsResponse = {
    events: Event[];
};
