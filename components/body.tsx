import { Calendar } from "./calendar";

export function Body() {
    return (
        <main className="bg-zinc-950 flex-1 flex justify-center p-4 sm:p-6">
            <div className="bg-zinc-900 rounded-3xl flex-1 p-4">
                <Calendar />
            </div>
        </main>
    );
}
