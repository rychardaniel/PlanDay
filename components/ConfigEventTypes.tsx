import { useEventTypes } from "@/context/EventTypesContext";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

export const ConfigEventTypes = () => {
    const { eventTypes: eventTypesData } = useEventTypes();

    const columns: GridColDef[] = [
        { field: "eventTypeName", headerName: "Nome do tipo", width: 300 },
        {
            field: "eventTypeColor",
            headerName: "Cor do tipo",
            width: 120,
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

    return (
        <Paper sx={{ height: "100%", width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                // checkboxSelection
                sx={{ border: 0 }}
            />
        </Paper>
    );
};
