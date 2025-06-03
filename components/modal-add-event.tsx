import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { format, isValid } from "date-fns";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ptBR } from "date-fns/locale";
import MenuItem from "@mui/material/MenuItem";
import { useEventsTypes } from "@/hooks/useEventsTypes";
import Button from "@mui/material/Button";

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
    const [nameEvent, setNameEvent] = useState<string>("");
    const [date, setDate] = useState<Date | null>(selectedDate);
    const [typeEvent, setTypeEvent] = useState<string>("");

    useEffect(() => {
        setDate(selectedDate);
        setNameEvent("");
        setTypeEvent("");
    }, [selectedDate, open]);

    const eventTypesData = useEventsTypes();

    const handleTypeEventChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTypeEvent(event.target.value as string);
    };

    const handleSubmit = async () => {
        // Lógica para salvar o evento
        if (!nameEvent || !date || !typeEvent) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
        console.log("Salvando evento:", {
            name: nameEvent,
            date: date ? format(date, "yyyy-MM-dd") : null,
            typeId: typeEvent,
        });
        // addEventToAPI({ title: nameEvent, date: format(date, "yyyy-MM-dd"), typeId: typeEvent, ... });
        handleClose(); // Fechar o modal após salvar
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 4,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                        }}
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{ textAlign: "center" }}
                        >
                            {date && isValid(date)
                                ? `Criar evento para ${format(
                                      date,
                                      "dd/MM/yyyy"
                                  )}`
                                : "Selecione uma data válida"}
                        </Typography>
                        <TextField
                            sx={{ width: "100%" }}
                            id="name-event-input"
                            label="Nome do evento"
                            variant="outlined"
                            required
                            onChange={(e) => setNameEvent(e.target.value)}
                            value={nameEvent}
                        />
                        <Box sx={{ width: "100%", display: "flex", gap: 1 }}>
                            <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                                adapterLocale={ptBR}
                            >
                                <DatePicker
                                    sx={{ width: "50%" }}
                                    value={date}
                                    onChange={(newDate: Date | null) =>
                                        setDate(newDate)
                                    }
                                />
                            </LocalizationProvider>
                            <TextField
                                sx={{ width: "50%" }}
                                id="event-type-select"
                                select
                                required
                                label="Tipo de Evento"
                                value={typeEvent}
                                onChange={handleTypeEventChange}
                                // helperText={
                                //     !typeEvent &&
                                //     eventTypesData.types?.length > 0
                                //         ? "Selecione o tipo"
                                //         : ""
                                // }
                            >
                                {eventTypesData.types &&
                                eventTypesData.types.length > 0 ? (
                                    eventTypesData.types.map(
                                        (type: EventType) => (
                                            <MenuItem
                                                key={String(type.id)}
                                                value={String(type.id)}
                                            >
                                                {String(type.name)}
                                            </MenuItem>
                                        )
                                    )
                                ) : (
                                    <MenuItem disabled>
                                        Nenhum tipo disponível
                                    </MenuItem>
                                )}
                            </TextField>
                        </Box>
                        <Box
                            sx={{
                                mt: 3,
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1,
                            }}
                        >
                            <Button onClick={handleClose} color="error">
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={
                                    !nameEvent || !date || !typeEvent || true // Desativado por enquanto
                                }
                            >
                                Salvar Evento
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
