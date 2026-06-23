import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";

export default function MenuTemplatesPage() {
  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="space-y-6 py-12">
          <p className="text-xs font-medium uppercase tracking-widest text-gold">
            Chef Tools
          </p>
          <h1 className="font-serif text-4xl font-medium text-ink">
            Menu Templates
          </h1>
          <p className="max-w-lg text-ink-muted">
            Save and reuse tiered menu templates for Classic, Signature, and
            Executive proposals. Coming soon.
          </p>
        </div>
      </PageContainer>
    </>
  );
}
