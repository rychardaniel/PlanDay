import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { format } from "date-fns";

interface Props {
    open: boolean;
    handleClose: () => void;
    selectedDate: Date;
    events?: EventItem[];
}
export default function DrawerEventsDay({
    open,
    handleClose,
    selectedDate,
    events,
}: Props) {
    const list = () => (
        <Box
            sx={{
                width: "auto",
                height: "60vh",
            }}
            onClick={handleClose}
        >
            <List sx={{ display: "flex", justifyContent: "center" }}>
                <div className="w-full max-w-[600px]">
                    <div className="flex justify-center">
                        <h2>{format(selectedDate, "dd/MM/yyyy")}</h2>
                    </div>
                    <div>
                        {events && events.length > 0 ? (
                            events.map((event: EventItem) => (
                                <ListItem key={event.id} disablePadding>
                                    <ListItemButton>
                                        <ListItemText primary={event.title} />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        ) : (
                            <ListItemText
                                primary={"Nenhuma evento para esse dia"}
                            />
                        )}
                    </div>
                </div>
            </List>
        </Box>
    );

    return (
        <div>
            <Drawer anchor={"bottom"} open={open} onClose={handleClose}>
                {list()}
            </Drawer>
        </div>
    );
}
