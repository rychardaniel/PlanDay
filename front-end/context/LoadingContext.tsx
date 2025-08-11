"use client";

import { createContext, useContext, useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

const LoadingContext = createContext<{ loading: boolean }>({ loading: false });

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <LoadingContext.Provider value={{ loading }}>
            {loading && <LoadingScreen />}
            <div
                className={`${
                    loading ? "opacity-0" : "opacity-100"
                } transition-opacity duration-500`}
            >
                {children}
            </div>
        </LoadingContext.Provider>
    );
}
