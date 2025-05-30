import { formatDateWithCapitalizedDay } from "@/utils/formatDate";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

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
                }}
            >
                <Typography variant="h6" component="h2" fontWeight="bold">
                    {formatDateWithCapitalizedDay(selectedDate)}
                </Typography>
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
                        events.map((event) => (
                            <ListItem
                                key={event.id}
                                disablePadding
                                sx={{
                                    paddingX: { xs: 1, sm: 2 },
                                }}
                            >
                                <Accordion sx={{ width: "100%" }}>
                                    <AccordionSummary
                                        expandIcon={<KeyboardArrowDownIcon />}
                                        aria-controls={`panel-${event.id}-content`}
                                        id={`panel-${event.id}-header`}
                                    >
                                        <Typography component="span">
                                            {event.title}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            Detalhes do evento: {event.id}
                                            {/* {event.description || "Sem descrição."} */}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText
                                primary="Nenhum evento para este dia."
                                sx={{ textAlign: "center", paddingY: 2 }}
                            />
                        </ListItem>
                    )}
                </List>
            </Box>
        </Box>
    );

    return (
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
                    },
                },
            }}
        >
            {drawerContent}
        </Drawer>
    );
}
