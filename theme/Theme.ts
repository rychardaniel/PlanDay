import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        info: {
            main: "#000000",
        },
        secondary: {
            main: "#e09898",
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        info: {
            main: "#FFFFFF",
        },
        secondary: {
            main: "#7a3330",
        },
    },
});
