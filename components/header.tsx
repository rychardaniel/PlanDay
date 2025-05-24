import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Avatar, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Link from "next/link";
import ThemeToggleButton from "./ThemeToggleButton";

export function Header() {
    return (
        <header className="dark:bg-zinc-800 bg-zinc-200 w-full py-2 px-6 flex justify-center">
            <div className="flex flex-row justify-between w-full max-w-[1400px]">
                <div className="flex flex-row gap-2 items-center">
                    <Link href={"/calendar"}>
                        <CalendarMonthIcon fontSize="large" />
                    </Link>
                    <h2 className="text-2xl cursor-default">Calendar</h2>
                </div>
                <div className="flex flex-row gap-2 items-center">
                    <ThemeToggleButton />
                    <Button color="info">
                        <SettingsIcon />
                    </Button>
                    <Button>
                        <Avatar>U</Avatar>
                    </Button>
                </div>
            </div>
        </header>
    );
}
