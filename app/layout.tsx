import { ThemeProvider } from "next-themes";
import { Lexend, Nunito } from "next/font/google";
import "./globals.css";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Songscribe",
  description: "The fastest way to turn any song into sheet music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${nunito.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex min-h-screen flex-col items-center">
            <div className="flex w-full flex-1 flex-col items-center">
              <div
                id="main-content-container"
                className="flex min-h-screen w-full flex-col items-center justify-center gap-20 px-5 pt-20"
              >
                {children}
              </div>

              <footer className="mx-auto flex flex-col items-start justify-center gap-8 py-16 text-center text-xs max-sm:ml-12 sm:flex-row sm:items-center">
                <h1 className="text-nowrap text-muted-foreground">
                  &copy; {new Date().getFullYear()} Songscribe
                </h1>
                <h1 className="text-nowrap text-muted-foreground">
                  Created by Gabriel Serna
                </h1>
                <h1 className="text-nowrap font-bold text-muted-foreground">
                  <Link href="https://github.com/gabe-serna/songscribe">
                    GitHub
                  </Link>
                </h1>
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
