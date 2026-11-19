
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.variable}>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}

