import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { SxProps, Theme } from "@mui/material/styles";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { ConfigEventTypes } from "./ConfigEventTypes";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";

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
    display: "flex",
    flexDirection: "column",
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
            className="h-full w-full"
        >
            {value === index && (
                <Box sx={{ p: 3, height: "100%" }}>{children}</Box>
            )}
        </div>
    );
}

export function ModalConfig({ open, handleClose }: ModalConfigProps) {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Box sx={{ display: "flex", justifyContent: "end" }}>
                        <IconButton onClick={handleClose} size="small">
                            <Close />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: "calc(100% - 75px)" }}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs value={value} onChange={handleChange}>
                                <Tab label="Tipos de Eventos" />
                                {/* <Tab label="Outros" /> */}
                            </Tabs>
                        </Box>
                        <Box sx={{ height: "100%" }}>
                            <TabPanel value={value} index={0}>
                                <ConfigEventTypes />
                            </TabPanel>
                            {/* <TabPanel value={value} index={1}>
                                Em desenvolvimento
                            </TabPanel> */}
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
