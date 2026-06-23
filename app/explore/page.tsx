import { Navbar } from "@/components/layout/Navbar";
import { ExploreView } from "@/components/explore/ExploreView";

export default function ExplorePage() {
  return (
    <div className="h-dvh overflow-hidden">
      <Navbar />
      <ExploreView />
    </div>
  );
}
