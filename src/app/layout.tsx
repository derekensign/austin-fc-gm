import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, SidebarProvider, MainContent } from "@/components/layout";
import { ChatWidget } from "@/components/chat";

export const metadata: Metadata = {
  title: "Verde Manager | Austin FC Analytics & Roster Tools",
  description: "Advanced analytics and roster management tools for Austin FC fans. Research stats, analyze roster rules, and explore transfer possibilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        <SidebarProvider>
          <div className="flex min-h-screen w-screen">
          <Sidebar />
            <MainContent>
              {children}
            </MainContent>
            </div>
          <ChatWidget />
        </SidebarProvider>
      </body>
    </html>
  );
}
