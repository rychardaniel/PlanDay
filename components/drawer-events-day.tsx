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
import { ModalAddEvent } from "./modal-add-event";
import { useState } from "react";
import { useEventTypes } from "@/context/EventTypesContext";
import { useEventsContext } from "@/context/EventsContext";

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
    const {
        eventTypes: eventTypesData,
        isLoading: isLoadingTypes,
        error: typesError,
    } = useEventTypes();

    const { refreshMonth } = useEventsContext();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const { mode } = useThemeMode();

    const handleEditEventById = () => {};

    const handleDeleteEventById = async (eventId: string) => {
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
                        onClick={handleOpenModal}
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
                                                    }}
                                                ></Box>
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
                                                        onClick={
                                                            handleEditEventById
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
            <ModalAddEvent
                open={isModalOpen}
                handleClose={handleCloseModal}
                selectedDate={selectedDate}
            />
        </div>
    );
}
