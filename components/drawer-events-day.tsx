import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Alert from "@mui/material/Alert";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { formatDateWithCapitalizedDay } from "@/utils/formatDate";
import { useThemeMode } from "@/theme/ThemeContext";
import { useState } from "react";
import { useEventTypes } from "@/context/EventTypesContext";
import { useEventsContext } from "@/context/EventsContext";
import { EventFormModal } from "./event-form-modal";
import tinycolor from "tinycolor2";

interface DrawerEventsDayProps {
    open: boolean;
    handleClose: () => void;
    selectedDate: Date;
    events?: EventItem[];
}

export function DrawerEventsDay({
    open,
    handleClose,
    selectedDate,
    events,
}: DrawerEventsDayProps) {
    const { refreshMonth } = useEventsContext();
    const { eventTypes: eventTypesData } = useEventTypes();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null);
    const [mutatingEventId, setMutatingEventId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenAddModal = () => {
        setEventToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (event: EventItem) => {
        setEventToEdit(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEventToEdit(null); // Limpa o evento em edição ao fechar
    };

    const handleCreateEvent = async (eventPayload: eventPayload) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventPayload),
            });
            if (!response.ok) throw new Error((await response.json()).error);
            refreshMonth(new Date(eventPayload.date));
            handleCloseModal();
        } catch (error) {
            console.error("Erro ao salvar evento:", error);
            alert(`Erro ao salvar evento: ${error}`);
        } finally {
            setIsSubmitting(false);
            handleCloseModal();
        }
    };

    const handleUpdateEvent = async (eventPayload: any) => {
        if (!eventToEdit) return;

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/events/${eventToEdit.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventPayload),
            });
            if (!response.ok) throw new Error((await response.json()).error);
            refreshMonth(new Date(eventPayload.date));
            handleCloseModal();
        } catch (error) {
            console.error("Erro ao editar evento:", error);
            alert(`Erro ao editar evento: ${error}`);
        } finally {
            setIsSubmitting(false);
            handleCloseModal();
        }
    };

    const { mode } = useThemeMode();

    const handleDeleteEventById = async (eventId: string) => {
        setMutatingEventId(eventId);

        try {
            const response = await fetch(`api/events/${eventId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();

                console.error("Erro ao excluir evento:", errorData);

                alert(`Erro ao excluir evento: ${errorData.error}`);
                return;
            }

            refreshMonth(selectedDate);
        } catch (error) {
            console.error("Falha ao conectar com o servidor:", error);
            alert(
                "Falha ao conectar com o servidor para excluir o evento. Verifique sua conexão."
            );
        } finally {
            setMutatingEventId(null);
        }
    };

    const drawerContent = (
        <Box
            sx={{
                width: { xs: "100vw", sm: 400, md: 500 },
                display: "flex",
                flexDirection: "column",
                height: "60vh",
            }}
            role="presentation"
        >
            <Box
                sx={{
                    padding: 2,
                    borderBottom: 1,
                    marginBottom: 1,
                    borderColor: "divider",
                    textAlign: "center",
                    flexShrink: 0,
                    position: "relative",
                }}
            >
                <Typography variant="h6" component="h2" fontWeight="bold">
                    {formatDateWithCapitalizedDay(selectedDate)}
                </Typography>
                <Tooltip title={"Adicionar evento"}>
                    <IconButton
                        size="medium"
                        color="primary"
                        onClick={handleOpenAddModal}
                        sx={{
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    >
                        <Add fontSize="medium" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    paddingX: 0,
                    paddingY: 1,
                }}
            >
                <List
                    sx={{
                        paddingY: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    {events && events.length > 0 ? (
                        events.map((event) => {
                            const type = eventTypesData.types.find(
                                (type) => type.id === event.typeId
                            );

                            const colorEvent = type?.color.toString();

                            const colorBgIsDark =
                                tinycolor(colorEvent).isDark();

                            return (
                                <ListItem
                                    key={event.id}
                                    disablePadding
                                    sx={{
                                        paddingX: { xs: 1, sm: 2 },
                                    }}
                                >
                                    <Accordion
                                        sx={{
                                            width: "100%",
                                            borderRadius: 2,
                                            boxShadow: 4,
                                            backgroundColor:
                                                mode == "dark"
                                                    ? "#272624  "
                                                    : "#f4f3f2",
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <KeyboardArrowDownIcon />
                                            }
                                            aria-controls={`panel-${event.id}-content`}
                                            id={`panel-${event.id}-header`}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    width: "100%",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    paddingRight: 3,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: "80%",
                                                    }}
                                                >
                                                    <Typography component="span">
                                                        {event.title}
                                                    </Typography>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        width: "60px",
                                                        height: "25px",
                                                        borderRadius: 3,
                                                        backgroundColor:
                                                            colorEvent,
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Typography
                                                        fontSize={10}
                                                        color={
                                                            colorBgIsDark
                                                                ? "white"
                                                                : "black"
                                                            // corTexto
                                                        }
                                                    >
                                                        {type?.name}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box sx={{ display: "flex" }}>
                                                <Box sx={{ width: "85%" }}>
                                                    <Typography>
                                                        {event.description ||
                                                            "Sem descrição"}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        width: "15%",
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleOpenEditModal(
                                                                event
                                                            )
                                                        }
                                                        disabled={
                                                            !!mutatingEventId
                                                        }
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            handleDeleteEventById(
                                                                event.id
                                                            )
                                                        }
                                                        disabled={
                                                            !!mutatingEventId
                                                        }
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </ListItem>
                            );
                        })
                    ) : (
                        <ListItem
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            <Alert severity="info">
                                Nenhum evento para este dia
                            </Alert>
                        </ListItem>
                    )}
                </List>
            </Box>
        </Box>
    );

    return (
        <div>
            <Drawer
                anchor="bottom"
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            borderTopLeftRadius: { xs: 20, sm: 30 },
                            borderTopRightRadius: { xs: 20, sm: 30 },
                            alignItems: "center",
                            background: mode == "dark" ? "#1e1d1a" : "#fefdfa",
                        },
                    },
                }}
            >
                {drawerContent}
            </Drawer>
            <EventFormModal
                open={isModalOpen}
                handleClose={handleCloseModal}
                onSubmit={eventToEdit ? handleUpdateEvent : handleCreateEvent}
                eventToEdit={eventToEdit}
                selectedDate={selectedDate}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
