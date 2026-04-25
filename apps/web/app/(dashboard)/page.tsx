// app/(dashboard)/page.tsx
// This page resolves to "/" inside the (dashboard) layout group.
// We immediately redirect to /dashboard so the root never renders blank.
import { redirect } from "next/navigation";

export default function DashboardRootPage() {
    redirect("/dashboard");
}
