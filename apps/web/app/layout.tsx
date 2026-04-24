import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

export const viewport: Viewport = {
  themeColor: "#08090b",
};

export const metadata: Metadata = {
  title: {
    default: "FocusRoom",
    template: "%s · FocusRoom",
  },
  description: "Deep-work rooms with synchronized pomodoro timers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}