import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@/theme/ThemeContext";
import MuiWrapper from "@/theme/MuiWrapper";
import "./globals.css";
import { LoadingProvider } from "@/context/LoadingContext";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    variable: "--font-roboto",
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Academic Calendar",
    description: "Um calendário simples para academicos",
    icons: {
        icon: "./favicon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body
                className={`${geistSans.variable} ${roboto.variable} ${geistMono.variable} antialiased`}
            >
                <AppRouterCacheProvider>
                    <ThemeProvider>
                        <MuiWrapper>
                            <LoadingProvider>{children}</LoadingProvider>
                        </MuiWrapper>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
