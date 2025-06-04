import { Header } from "@/components/header";
import { Body } from "@/components/body";
import { EventTypesProvider } from "@/context/EventTypesContext";

export default function Calendar() {
    return (
        <div className="min-h-screen w-screen flex flex-col">
            <EventTypesProvider>
                <Header />
                <Body />
            </EventTypesProvider>
        </div>
    );
}
