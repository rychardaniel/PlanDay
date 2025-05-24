export function HeaderMounthViewCalendar() {
    const days = [
        { acronym: "D", id: 1 },
        { acronym: "S", id: 2 },
        { acronym: "T", id: 3 },
        { acronym: "Q", id: 4 },
        { acronym: "Q", id: 5 },
        { acronym: "S", id: 6 },
        { acronym: "S", id: 7 },
    ];

    return (
        <div className="w-full px-0.5 mb-2">
            <ul className="grid grid-cols-7 gap-1">
                {days.map((day) => (
                    <li
                        key={day.id}
                        className="flex justify-center items-center bg-zinc-50 dark:bg-zinc-800 py-1 text-sm font-medium text-black dark:text-white border border-zinc-400"
                    >
                        {day.acronym}
                    </li>
                ))}
            </ul>
        </div>
    );
}
