"use client";

import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeToggleButton from "./ThemeToggleButton";
import { EventFormModal } from "./EventFormModal";
import { useEventsContext } from "@/context/EventsContext";
import BasicModal from "./ConfigModal";
import SettingsButton from "./SettingsButton";
import AddEventButton from "./AddEventButton";

export const Header: React.FC = () => {
    const { refreshMonth } = useEventsContext();

    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isMenuOpen = Boolean(menuAnchorEl);

    const handleOpenAddEventModal = () => setIsAddEventModalOpen(true);
    const handleCloseAddEventModal = () => setIsAddEventModalOpen(false);

    const handleOpenConfigModal = () => setIsConfigModalOpen(true);
    const handleCloseConfigModal = () => setIsConfigModalOpen(false);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleCreateEvent = async (eventPayload: EventPayload) => {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventPayload),
            });
            if (!response.ok) throw new Error((await response.json()).error);
            refreshMonth(new Date(eventPayload.date));
            handleCloseAddEventModal();
        } catch (error) {
            console.error("Erro ao salvar evento:", error);
            alert(`Erro ao salvar evento: ${error}`);
        } finally {
            setIsSubmitting(false);
            handleCloseAddEventModal();
        }
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
                            <SettingsButton onClick={handleOpenConfigModal} />
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <AddEventButton onClick={handleOpenAddEventModal} />
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            <EventFormModal
                open={isAddEventModalOpen}
                handleClose={handleCloseAddEventModal}
                selectedDate={new Date()}
                onSubmit={handleCreateEvent}
                isSubmitting={isSubmitting}
            />
            <BasicModal
                open={isConfigModalOpen}
                handleClose={handleCloseConfigModal}
            />
        </header>
    );
};
