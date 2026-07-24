import Link from "next/link";
import { LearningHome, LevelList } from "@/components/learning/LevelList";
import { PrismaLearningRepository } from "@/infrastructure/repositories/PrismaLearningRepository";

export default async function HomePage() {
  const levels = await new PrismaLearningRepository().listLevels();

  return (
    <LearningHome
      eyebrow="Mobile learning"
      title="Sonar Products"
      description="Study Sonar products, governance concepts, and CSE interview scenarios in short levels that work well on a phone."
      action={<Link href="/offline" className="mt-5 inline-flex min-h-12 items-center rounded-lg border border-good bg-good/10 px-4 py-3 font-medium text-good transition hover:bg-good/15">Open offline study mode</Link>}
    >
      {levels.length === 0 ? <EmptyState /> : <LevelList levels={levels} hrefForLevel={(level) => `/levels/${level.id}`} />}
    </LearningHome>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-line bg-panel p-6 text-center">
      <h2 className="text-xl font-semibold">No levels available</h2>
      <p className="mt-3 text-sm text-slate-300">
        Import validated local JSON content with <code className="rounded bg-ink px-2 py-1">npm run content:import -- path/to/content.json</code>.
      </p>
    </div>
  );
}
