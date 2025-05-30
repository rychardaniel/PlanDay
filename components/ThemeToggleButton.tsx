"use client";

import { Button } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeMode } from "@/theme/ThemeContext";

export default function ThemeToggleButton() {
    const { mode, toggleTheme } = useThemeMode();

    return (
        <Button onClick={toggleTheme} color="primary" size="small">
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </Button>
    );
}
