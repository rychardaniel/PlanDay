import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { format } from "date-fns";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

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
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Criar evento para {format(selectedDate, "dd/MM/yyyy")}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Em desenvolvimento
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
