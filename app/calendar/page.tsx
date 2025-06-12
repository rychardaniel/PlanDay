import { Header } from "@/components/Header";
import { Body } from "@/components/Body";
import { EventTypesProvider } from "@/context/EventTypesContext";
import { EventsProvider } from "@/context/EventsContext";

export default function Calendar() {
    return (
        <div className="min-h-screen w-screen flex flex-col">
            <EventTypesProvider>
                <EventsProvider>
                    <Header />
                    <Body />
                </EventsProvider>
            </EventTypesProvider>
        </div>
    );
}
