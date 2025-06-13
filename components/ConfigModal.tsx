import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { SxProps, Theme } from "@mui/material/styles";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEventTypes } from "@/context/EventTypesContext";

interface ModalConfigProps {
    open: boolean;
    handleClose: () => void;
}

const style: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "90%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
    borderRadius: 4,
};

export function ModalConfig({ open, handleClose }: ModalConfigProps) {
    const { eventTypes: eventTypesData } = useEventTypes();

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <IconButton onClick={handleClose} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                    {eventTypesData.types.map((type) => {
                        return <div key={String(type.id)}>{type.name}</div>;
                    })}
                </Box>
            </Modal>
        </div>
    );
}
