import { GlossaryView } from "@/components/learning/GlossaryView";

export const dynamic = "force-static";

export default function OfflineGlossaryPage() {
  return <GlossaryView homeHref="/offline" />;
}
