// components/ThemeToggleButton.tsx
"use client";

import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeMode } from "@/theme/ThemeContext";

export default function ThemeToggleButton() {
    const { mode, toggleTheme } = useThemeMode();

    return (
        <IconButton onClick={toggleTheme} color="inherit">
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
    );
}
