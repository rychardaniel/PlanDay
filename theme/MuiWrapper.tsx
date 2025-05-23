"use client";

import { CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { useThemeMode } from "./ThemeContext";
import { darkTheme, lightTheme } from "./theme";

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
