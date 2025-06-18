// /components/modal-event-form.tsx

"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ptBR } from "date-fns/locale";
import { format, isValid } from "date-fns";
import { useEffect, useState } from "react";
import { useEventTypes } from "@/context/EventTypesContext";
import CircularProgress from "@mui/material/CircularProgress";
import { SxProps, Theme } from "@mui/material/styles";

interface ModalEventFormProps {
    open: boolean;
    handleClose: () => void;
    onSubmit: (eventData: EventPayload) => Promise<void>;
    eventToEdit?: EventItem | null;
    selectedDate: Date;
    isSubmitting: boolean;
}

const style: SxProps<Theme> = {
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
};

export function EventFormModal({
    open,
    handleClose,
    onSubmit,
    eventToEdit,
    selectedDate,
    isSubmitting,
}: ModalEventFormProps) {
    const { eventTypes: eventTypesData } = useEventTypes();
    const isEditMode = Boolean(eventToEdit);

    const [titleEvent, setTitleEvent] = useState("");
    const [dateEvent, setDateEvent] = useState<Date | null>(null);
    const [typeEvent, setTypeEvent] = useState("");
    const [descriptionEvent, setDescriptionEvent] = useState("");

    useEffect(() => {
        if (open) {
            if (isEditMode && eventToEdit) {
                setTitleEvent(eventToEdit.title);
                setDateEvent(new Date(eventToEdit.date));
                setTypeEvent(eventToEdit.typeId);
                setDescriptionEvent(eventToEdit.description || "");
            } else {
                setTitleEvent("");
                setDateEvent(selectedDate);
                setTypeEvent("");
                setDescriptionEvent("");
            }
        }
    }, [open, eventToEdit, isEditMode, selectedDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titleEvent || !dateEvent || !typeEvent) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const eventPayload: EventPayload = {
            title: titleEvent,
            date: format(dateEvent, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
            description: descriptionEvent,
            typeId: typeEvent,
            materials: "",
        };

        await onSubmit(eventPayload);
    };

    return (
        <Modal open={open} onClose={isSubmitting ? () => {} : handleClose}>
            <Box component="form" onSubmit={handleSubmit} sx={style}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{ textAlign: "center" }}
                    >
                        {dateEvent && isValid(dateEvent)
                            ? isEditMode
                                ? `Editar evento dia ${
                                      dateEvent
                                          ? format(dateEvent, "dd/MM/yyyy")
                                          : ""
                                  }`
                                : `Criar evento para ${
                                      dateEvent
                                          ? format(dateEvent, "dd/MM/yyyy")
                                          : ""
                                  }`
                            : "Selecione uma data válida"}
                    </Typography>

                    <TextField
                        label="Nome do evento"
                        variant="outlined"
                        required
                        value={titleEvent}
                        onChange={(e) => setTitleEvent(e.target.value)}
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <LocalizationProvider
                            dateAdapter={AdapterDateFns}
                            adapterLocale={ptBR}
                        >
                            <DatePicker
                                label="Data do Evento"
                                sx={{ width: "50%" }}
                                value={dateEvent}
                                onChange={(newDate) => setDateEvent(newDate)}
                            />
                        </LocalizationProvider>
                        <TextField
                            select
                            required
                            label="Tipo de Evento"
                            sx={{ width: "50%" }}
                            value={typeEvent}
                            onChange={(e) => setTypeEvent(e.target.value)}
                        >
                            {eventTypesData.types?.map((type: EventType) => (
                                <MenuItem
                                    key={String(type.id)}
                                    value={String(type.id)}
                                >
                                    {String(type.name)}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <TextField
                        label="Descrição da atividade"
                        fullWidth
                        multiline
                        minRows={1}
                        maxRows={5}
                        value={descriptionEvent}
                        onChange={(e) => setDescriptionEvent(e.target.value)}
                    />
                    <Box
                        sx={{
                            mt: 3,
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                        }}
                    >
                        <Button
                            onClick={handleClose}
                            color="error"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={
                                !titleEvent ||
                                !dateEvent ||
                                !typeEvent ||
                                isSubmitting
                            }
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : isEditMode ? (
                                "Salvar Alterações"
                            ) : (
                                "Salvar Evento"
                            )}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
