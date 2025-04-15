import type React from "react"
import "@/app/globals.css"
import ClientProviders from "./client-providers"
export const metadata = {
    title: "Tech Cheatsheet",
    description: "Laravel, PHP, MySQL & JavaScript Cheatsheet",
    generator: 'v0.dev'
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ClientProviders>
            {children}
        </ClientProviders>
        </body>
        </html>
    )
}