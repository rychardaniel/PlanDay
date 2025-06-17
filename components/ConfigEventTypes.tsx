import { useEventTypes } from "@/context/EventTypesContext";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

// interface Row {
//     id: string;
//     eventTypeName: string;
//     eventTypeColor: string;
// }

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

    const handleProcessRowUpdate = async (newRow: any, oldRow: any) => {
        if (JSON.stringify(newRow) === JSON.stringify(oldRow)) {
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

            const updatedRow: EventType = await response.json();

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
