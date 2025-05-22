import { Calendar } from "./calendar";

export function Body() {
    return (
        <main className="bg-zinc-950 h-[calc(100vh-68px)] flex justify-center">
            <div className="bg-zinc-900 rounded-3xl w-full p-4 m-4 sm:m-6 overflow-hidden">
                <Calendar />
            </div>
        </main>
    );
}
