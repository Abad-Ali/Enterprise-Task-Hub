import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { ReduxProvider } from "./provider";
import ProtectedAuth from "@/components/ProtectedAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Enterprise Task Hub (ETH)",
  description: "Enterprise Task Hub helps organizations streamline how work gets done. It brings together project execution, task management, team collaboration, approval workflows, and performance tracking into a single unified platform—allowing managers ans admin to assign and oversee work effortlessly while teams stay aligned and productive.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <Toaster richColors position="bottom-right" />
          <ProtectedAuth>
        <div className="min-h-screen w-full relative bg-black">
          {/* X Organizations Black Background with Top Glow */}
          <div
            className="absolute inset-0 z-0"
            style={{
             background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
            }}
          />
        
          {/* Your Content/Components */}
        {children}
        </div>
        </ProtectedAuth>
        </ReduxProvider>
      </body>
    </html>
  );
}
