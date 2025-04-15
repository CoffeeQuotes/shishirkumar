'use client'
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"
import {ThemeProvider} from "@/components/theme-provider";

export default function ClientProviders({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
                <Toaster />
            </ThemeProvider>
        </SessionProvider>
    )
}