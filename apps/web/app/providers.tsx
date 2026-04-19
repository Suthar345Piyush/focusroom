"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ToastProvider } from "@/components/ui/toast";

// Clerk appearance tokens matched to FocusRoom design system
const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorBackground:       "#0e1014",
    colorInputBackground:  "#141720",
    colorInputText:        "#eef0f7",
    colorText:             "#eef0f7",
    colorTextSecondary:    "#8891aa",
    colorPrimary:          "#6382ff",
    colorDanger:           "#f87171",
    borderRadius:          "10px",
    fontFamily:            "DM Sans, sans-serif",
    fontFamilyButtons:     "Syne, sans-serif",
    fontSize:              "15px",
  },
  elements: {
    card:            "bg-bg-surface border border-border shadow-md",
    headerTitle:     "font-display text-text-primary",
    headerSubtitle:  "text-text-secondary",
    formButtonPrimary: "btn-primary",
    formFieldInput:  "input",
    footerActionLink: "text-text-accent hover:text-accent",
    dividerLine:     "bg-border",
    dividerText:     "text-text-muted font-mono text-xs",
  },
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      {children}
      <ToastProvider />
    </ClerkProvider>
  );
}

