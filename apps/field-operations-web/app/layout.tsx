import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KONOS SUITES — Mission terrain",
  description: "Application terrain pour les rotations KONOS SUITES",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
