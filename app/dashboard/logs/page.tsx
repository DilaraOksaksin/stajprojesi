import { redirect } from "next/navigation";

export const metadata = {
  title: "Loglar",
};

export default function LogsPage() {
  redirect("/dashboard/activity");
}
