"use client";

import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeToggleButton from "./ThemeToggleButton";
import { ModalAddEvent } from "./modal-add-event";

export const Header: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(menuAnchorEl);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    return (
        <header className="w-full bg-fundo-claro-1 dark:bg-fundo-escuro-1 px-6 py-2 flex justify-center">
            <div className="w-full max-w-[1400px] flex justify-between items-center">
                <div className="flex items-center gap-2 text-xl text-black dark:text-white">
                    <CalendarMonthIcon />
                    <h2 className="cursor-default">Calendário</h2>
                </div>

                <div>
                    <IconButton
                        onClick={handleMenuOpen}
                        aria-controls={isMenuOpen ? "header-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen ? "true" : undefined}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="header-menu"
                        anchorEl={menuAnchorEl}
                        open={isMenuOpen}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleMenuClose}>
                            <ThemeToggleButton />
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <IconButton size="small" color="primary">
                                <SettingsIcon />
                            </IconButton>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                handleOpenModal();
                            }}
                        >
                            <IconButton size="small" color="primary">
                                <AddIcon />
                            </IconButton>
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            <ModalAddEvent
                open={isModalOpen}
                handleClose={handleCloseModal}
                selectedDate={new Date()}
            />
        </header>
    );
};
