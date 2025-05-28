"use client";

import { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import ThemeToggleButton from "./ThemeToggleButton";
import { ModalAddEvent } from "./modal-add-event";

export function Header() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <header className="dark:bg-fundo-escuro-1 bg-fundo-claro-1 w-full py-2 px-6 flex justify-center">
            <div className="flex flex-row justify-between w-full max-w-[1400px]">
                <div className="flex flex-row gap-2 items-center text-black dark:text-white text-xl">
                    <CalendarMonthIcon />
                    <h2 className="cursor-default">Calendário</h2>
                </div>

                <div className="flex flex-row gap-2 items-center">
                    <Button size="small" color="info" onClick={handleOpen}>
                        <Add />
                    </Button>
                    <Button color="info" size="small">
                        <SettingsIcon />
                    </Button>
                    <ThemeToggleButton />
                </div>
            </div>
            <ModalAddEvent
                handleClose={handleClose}
                open={open}
                selectedDate={new Date()}
            />
        </header>
    );
}
