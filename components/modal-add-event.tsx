"use client";

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
    const [dateEvent, setDateEvent] = useState<Date | null>(selectedDate);
    const [typeEvent, setTypeEvent] = useState<string>("");
    const [descriptionEvent, setDescriptionEvent] = useState<string>("");

    useEffect(() => {
        setDateEvent(selectedDate);
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
        if (!nameEvent || !dateEvent || !typeEvent) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const eventPayload = {
            title: nameEvent,
            date: format(dateEvent, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"), // Formato ISO 8601
            description: descriptionEvent,
            typeId: typeEvent,
        };

        try {
            const response = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();

                console.error("Erro ao salvar evento:", errorData);

                alert(
                    `Erro ao salvar evento: ${
                        errorData.message ||
                        errorData.error ||
                        response.statusText
                    }`
                );
                return;
            }

            const newEventFromApi: EventItem = await response.json();

            // onEventAdded(newEventFromApi);

            handleClose();
        } catch (error) {
            console.error("Falha ao conectar com o servidor:", error);
            alert(
                "Falha ao conectar com o servidor para salvar o evento. Verifique sua conexão."
            );
        }
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
                            {dateEvent && isValid(dateEvent)
                                ? `Criar evento para ${format(
                                      dateEvent,
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
                                    value={dateEvent}
                                    onChange={(newDate: Date | null) =>
                                        setDateEvent(newDate)
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
                        <TextField
                            id="description-event-input"
                            label="Descrição da atividade"
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={5}
                            variant="outlined"
                            value={descriptionEvent}
                            onChange={(e) =>
                                setDescriptionEvent(e.target.value)
                            }
                        />
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
                                    !nameEvent || !dateEvent || !typeEvent
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
