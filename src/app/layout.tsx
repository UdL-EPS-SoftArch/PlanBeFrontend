import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { AuthProvider } from "@/app/components/authentication";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
    weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
    title: {
        default: "PlanBe — Quedadas con gente cerca de ti",
        template: "%s · PlanBe",
    },
    description: "Encuentra quedadas que encajan con tus intereses, apúntate en un clic y conoce a gente que quiere hacer lo mismo que tú.",
    applicationName: "PlanBe",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} flex min-h-screen flex-col`}>
                <AuthProvider>
                    <Navbar />
                    <div className="flex flex-1 flex-col">
                        {children}
                    </div>
                    <Footer />
                </AuthProvider>
                <Toaster richColors position="top-center" />
            </body>
        </html>
    );
}
