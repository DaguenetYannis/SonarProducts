import Link from "next/link";
import { PrismaLearningRepository } from "@/infrastructure/repositories/PrismaLearningRepository";

export default async function HomePage() {
  const levels = await new PrismaLearningRepository().listLevels();

  return (
    <main className="min-h-dvh py-8 sm:py-10">
      <section className="mx-auto flex max-w-3xl flex-col gap-7">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-good">Mobile learning</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Sonar Products</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300">
            Study Sonar products, governance concepts, and CSE interview scenarios in short levels that work well on a phone.
          </p>
          <Link href="/offline" className="mt-5 inline-flex min-h-12 items-center rounded-lg border border-good bg-good/10 px-4 py-3 font-medium text-good transition hover:bg-good/15">
            Open offline study mode
          </Link>
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
              <Link key={level.id} href={`/levels/${level.id}`} className="rounded-lg border border-line bg-panel p-5 transition hover:border-good active:border-good">
                <div className="grid gap-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{level.title}</h2>
                    <p className="mt-1 text-sm text-slate-300">{level.topics.join(", ")}</p>
                  </div>
                  <span className="w-fit rounded-full border border-line px-3 py-1 text-sm text-slate-300">{level.questionCount} questions</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
