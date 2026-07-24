import Link from "next/link";
import { PrismaLearningRepository } from "@/infrastructure/repositories/PrismaLearningRepository";

export default async function HomePage() {
  const levels = await new PrismaLearningRepository().listLevels();

  return (
    <main className="min-h-screen px-5 py-10">
      <section className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-good">Local learning</p>
          <h1 className="mt-3 text-4xl font-semibold">Learning Engine</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-300">
            No learning content has been imported yet. The app is ready for topics, levels, and mixed question sequences when you provide a content file.
          </p>
        </div>

        {levels.length === 0 ? (
          <div className="rounded-lg border border-line bg-panel p-6 text-center">
            <h2 className="text-xl font-semibold">No levels available</h2>
            <p className="mt-3 text-sm text-slate-300">
              Import validated local JSON content with <code className="rounded bg-ink px-2 py-1">npm run content:import -- path/to/content.json</code>.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {levels.map((level) => (
              <Link key={level.id} href={`/levels/${level.id}`} className="rounded-lg border border-line bg-panel p-5 transition hover:border-good">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{level.title}</h2>
                    <p className="mt-1 text-sm text-slate-300">{level.topics.join(", ")}</p>
                  </div>
                  <span className="text-sm text-slate-400">{level.questionCount} questions</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
