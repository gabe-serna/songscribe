import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { Lexend, Manjari } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

const manjari = Manjari({
  subsets: ["latin"],
  variable: "--font-manjari",
  weight: ["100", "400", "700"],
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
      className={`${lexend.variable} ${manjari.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen flex-col items-center">
            <div className="flex w-full flex-1 flex-col items-center gap-20">
              <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10"></nav>
              <div className="flex max-w-5xl flex-col gap-20 p-5">
                {children}
              </div>

              <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-16 text-center text-xs"></footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
