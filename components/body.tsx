import { Calendar } from "./calendar";

export function Body() {
    return (
        <main className="bg-zinc-950 h-[calc(100vh-68px)] flex justify-center">
            <div className="bg-zinc-900 rounded-3xl w-full p-4 m-4 sm:m-6 overflow-hidden">
                <div className="h-full overflow-y-auto pr-2 overflow-x-hidden">
                    <Calendar />
                    <div className="w-full">
                        <ul className="flex flex-row ">
                            <li className="flex justify-center w-1/7">D</li>
                            <li className="flex justify-center w-1/7">S</li>
                            <li className="flex justify-center w-1/7">T</li>
                            <li className="flex justify-center w-1/7">Q</li>
                            <li className="flex justify-center w-1/7">Q</li>
                            <li className="flex justify-center w-1/7">S</li>
                            <li className="flex justify-center w-1/7">S</li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
