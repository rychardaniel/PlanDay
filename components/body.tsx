import { Calendar } from "./calendar";
import { HeaderCalendar } from "./header-calendar";

export function Body() {
    return (
        <main className="bg-zinc-950 h-[calc(100vh-68px)] flex justify-center">
            <div className="bg-zinc-900 rounded-3xl w-full p-4 m-4 sm:m-6 overflow-hidden">
                <HeaderCalendar />
                <div className="h-full overflow-y-auto overflow-x-hidden">
                    <Calendar />
                </div>
            </div>
        </main>
    );
}
