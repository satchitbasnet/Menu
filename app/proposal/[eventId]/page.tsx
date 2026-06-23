import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { TieredProposalView } from "@/components/proposal/TieredProposalView";

type ProposalPageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { eventId } = await params;

  return (
    <>
      <Navbar minimal />
      <PageContainer wide>
        <TieredProposalView eventId={eventId} />
      </PageContainer>
    </>
  );
}
