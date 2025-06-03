import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { format } from "date-fns";
import TextField from "@mui/material/TextField";

interface ModalAddEventsProps {
    open: boolean;
    handleClose: () => void;
    selectedDate: Date;
}

export function ModalAddEvent({
    open,
    handleClose,
    selectedDate,
}: ModalAddEventsProps) {
    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        padding: 4,
                        borderRadius: 4,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{ textAlign: "center" }}
                        >
                            Criar evento para{" "}
                            {format(selectedDate, "dd/MM/yyyy")}
                        </Typography>
                        <TextField
                            sx={{ width: "100%" }}
                            id="outlined-basic"
                            label="Nome do evento"
                            variant="outlined"
                        />
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
