"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useThemeMode } from "./ThemeContext";
import { darkTheme, lightTheme } from "./Theme";

export default function MuiWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { mode } = useThemeMode();

    return (
        <MuiThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
}
