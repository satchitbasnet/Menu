import { Navbar } from "@/components/layout/Navbar";
import { PageContainer } from "@/components/layout/PageContainer";
import { MultiStepIntakeForm } from "@/components/intake/MultiStepIntakeForm";
import { prisma } from "@/lib/prisma";

type IntakePageProps = {
  params: Promise<{ chefId: string }>;
};

export default async function IntakePage({ params }: IntakePageProps) {
  const { chefId } = await params;

  let chefName: string | undefined;
  let activeServices: ("PRIVATE_DINNER" | "MEAL_PREP" | "COOKING_CLASS")[] = [
    "PRIVATE_DINNER",
    "MEAL_PREP",
    "COOKING_CLASS",
  ];

  try {
    const chef = await prisma.chef.findUnique({
      where: { id: chefId },
      select: { name: true, activeServices: true },
    });
    if (chef) {
      chefName = chef.name;
      activeServices = chef.activeServices;
    }
  } catch {
    chefName = "Chef Elena Martinez";
  }

  return (
    <>
      <Navbar minimal />
      <PageContainer>
        <MultiStepIntakeForm
          chefId={chefId}
          chefName={chefName}
          activeServices={activeServices}
        />
      </PageContainer>
    </>
  );
}
