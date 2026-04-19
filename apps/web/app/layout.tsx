import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "FocusRoom",
    template: "%s · FocusRoom",
  },
  description:
    "Deep-work rooms with synchronized pomodoro timers, live presence, and a leaderboard for the last focused one standing.",
  keywords: ["focus", "pomodoro", "productivity", "deep work", "coworking"],
  themeColor: "#08090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


