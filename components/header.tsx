"use client";

import { useState } from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Add } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import ThemeToggleButton from "./ThemeToggleButton";
import { ModalAddEvent } from "./modal-add-event";
import MenuIcon from "@mui/icons-material/Menu";

export function Header() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const handleOpenModal = () => setIsOpenModal(true);
    const handleCloseModal = () => setIsOpenModal(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <header className="dark:bg-fundo-escuro-1 bg-fundo-claro-1 w-full py-2 px-6 flex justify-center">
            <div className="flex flex-row justify-between w-full max-w-[1400px]">
                <div className="flex flex-row gap-2 items-center text-black dark:text-white text-xl">
                    <CalendarMonthIcon />
                    <h2 className="cursor-default">Calendário</h2>
                </div>

                <div>
                    <IconButton onClick={handleClick}>
                        <MenuIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        <MenuItem onClick={handleClose}>
                            <ThemeToggleButton />
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Button color="primary" size="small">
                                <SettingsIcon />
                            </Button>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <Button
                                size="small"
                                color="primary"
                                onClick={handleOpenModal}
                            >
                                <Add />
                            </Button>
                        </MenuItem>
                    </Menu>
                </div>
            </div>
            <ModalAddEvent
                handleClose={handleCloseModal}
                open={isOpenModal}
                selectedDate={new Date()}
            />
        </header>
    );
}
