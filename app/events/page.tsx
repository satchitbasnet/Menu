import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default async function EventsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirect=/events");
  }

  if (session.role !== "CHEF") {
    redirect("/explore");
  }

  return (
    <>
      <Navbar />
      <PageContainer wide>
        <DashboardView />
      </PageContainer>
    </>
  );
}
