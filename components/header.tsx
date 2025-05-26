import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Link from "next/link";
import ThemeToggleButton from "./ThemeToggleButton";
import { Add } from "@mui/icons-material";

export function Header() {
    return (
        <header className="dark:bg-fundo-escuro-1 bg-fundo-claro-1 w-full py-2 px-6 flex justify-center">
            <div className="flex flex-row justify-between w-full max-w-[1400px]">
                <div className="flex flex-row gap-2 items-center text-black dark:text-white text-xl">
                    <CalendarMonthIcon />
                    <h2 className="cursor-default">Calendário</h2>
                </div>

                <div className="flex flex-row gap-2 items-center">
                    <Button color="info" size="small">
                        <Add />
                    </Button>
                    <Button color="info" size="small">
                        <SettingsIcon />
                    </Button>
                    <div>
                        <ThemeToggleButton />
                    </div>
                </div>
            </div>
        </header>
    );
}
