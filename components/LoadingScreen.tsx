"use client";

import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

export default function LoadingScreen() {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <CircularProgress sx={{ color: "#fff" }} size={60} />
        </motion.div>
    );
}
