import { Calendar } from "./calendar";

export function Body() {
    return (
        <main className="bg-fundo-claro-1 dark:bg-fundo-escuro-1 h-[calc(100vh-56px)] flex justify-center">
            <div className="bg-fundo-claro-1 dark:bg-fundo-escuro-1 rounded-3xl w-full p-4 m-1 sm:m-3 overflow-hidden relative">
                <Calendar />
            </div>
        </main>
    );
}
