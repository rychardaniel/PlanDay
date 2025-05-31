import { formatDateWithCapitalizedDay } from "@/utils/formatDate";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    IconButton,
    Tooltip,
    Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Alert from "@mui/material/Alert";
import { useThemeMode } from "@/theme/ThemeContext";
import { ModalAddEvent } from "./modal-add-event";
import { useState } from "react";
import { Add } from "@mui/icons-material";

interface DrawerEventsDayProps {
    open: boolean;
    handleClose: () => void;
    selectedDate: Date;
    events?: EventItem[];
    eventTypes: EventTypes;
}

export function DrawerEventsDay({
    open,
    handleClose,
    selectedDate,
    events,
    eventTypes,
}: DrawerEventsDayProps) {
    const [isModalrOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const { mode } = useThemeMode();

    const drawerContent = (
        <Box
            sx={{
                width: { xs: "100vw", sm: 400, md: 500 },
                display: "flex",
                flexDirection: "column",
                height: "auto",
                minHeight: "40vh",
                maxHeight: "60vh",
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
                            right: 1,
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
                            const type = eventTypes.types.find(
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
                                            border: 1,
                                            borderColor: colorEvent,
                                            borderRadius: 2,
                                            boxShadow: 4,
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <KeyboardArrowDownIcon />
                                            }
                                            aria-controls={`panel-${event.id}-content`}
                                            id={`panel-${event.id}-header`}
                                        >
                                            <Typography
                                                component="span"
                                                sx={{
                                                    color: colorEvent?.toString(),
                                                }}
                                            >
                                                {event.title}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                {event.description ||
                                                    "Sem descrição"}
                                            </Typography>
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
                open={isModalrOpen}
                handleClose={handleCloseModal}
                selectedDate={selectedDate}
            />
        </div>
    );
}
