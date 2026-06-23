import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { ClientBookingsView } from "@/components/bookings/ClientBookingsView";

export default function BookingsPage() {
  return (
    <>
      <Navbar />
      <PageContainer>
        <ClientBookingsView />
      </PageContainer>
    </>
  );
}
