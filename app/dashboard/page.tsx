import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <PageContainer wide>
        <DashboardView />
      </PageContainer>
    </>
  );
}
