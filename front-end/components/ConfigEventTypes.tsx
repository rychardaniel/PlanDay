import { useEventTypes } from "@/context/EventTypesContext";
import {
    DataGrid,
    GridColDef,
    GridRenderEditCellParams,
} from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

type Row = {
    id: string;
    eventTypeName: string;
    eventTypeColor: string;
};

const ColorEditInputCell = (props: GridRenderEditCellParams) => {
    const { id, field, value, api } = props;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        api.setEditCellValue(
            { id, field, value: event.target.value.toUpperCase() },
            event
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <input
                type="color"
                value={value}
                onChange={handleChange}
                style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                }}
            />
        </Box>
    );
};

export const ConfigEventTypes = () => {
    const { eventTypes: eventTypesData, updateEventType } = useEventTypes();

    const columns: GridColDef[] = [
        {
            field: "eventTypeName",
            headerName: "Nome",
            width: 300,
            editable: true,
        },
        {
            field: "eventTypeColor",
            headerName: "Cor",
            width: 120,
            editable: true,
            headerAlign: "center",
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: params.value,
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                        }}
                    />
                    {params.value}
                </Box>
            ),
            renderEditCell: (params) => <ColorEditInputCell {...params} />,
        },
    ];

    const rows = eventTypesData.types.map((eventType) => {
        return {
            id: eventType.id,
            eventTypeName: eventType.name,
            eventTypeColor: eventType.color,
        };
    });

    const paginationModel = { page: 0, pageSize: 5 };

    const handleProcessRowUpdate = async (newRow: Row, oldRow: Row) => {
        if (JSON.stringify(newRow) === JSON.stringify(oldRow)) {
            return oldRow;
        }

        if (newRow.eventTypeName.length === 0) {
            return oldRow;
        }

        try {
            const response = await fetch(`/api/events/types/${newRow.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newRow.eventTypeName,
                    color: newRow.eventTypeColor,
                }),
            });

            if (!response.ok) {
                throw new Error("Falha ao atualizar o tipo de evento.");
            }

            const updatedRow = await response.json();

            updateEventType(updatedRow);

            return {
                id: updatedRow.id,
                eventTypeName: updatedRow.name,
                eventTypeColor: updatedRow.color,
            };
        } catch (error) {
            console.error(error);
            return oldRow;
        }
    };

    return (
        <Paper sx={{ height: "100%", width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                showToolbar
                processRowUpdate={handleProcessRowUpdate}
                onProcessRowUpdateError={(error) => console.error(error)}
                // checkboxSelection
                sx={{ border: 0 }}
            />
        </Paper>
    );
};
