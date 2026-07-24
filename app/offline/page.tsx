import Link from "next/link";
import { listStaticLevels } from "@/lib/staticLearningContent";

export const dynamic = "force-static";

export default function OfflineHomePage() {
  const levels = listStaticLevels();

  return (
    <main className="min-h-dvh py-8 sm:py-10">
      <section className="mx-auto flex max-w-3xl flex-col gap-7">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-good">Offline study</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Sonar Products</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300">
            Install this mode on your phone and study the bundled Sonar curriculum without a local server.
          </p>
        </div>

        <div className="grid gap-3">
          {levels.map((level) => (
            <Link key={level.id} href={`/offline/levels/${level.id}`} className="rounded-lg border border-line bg-panel p-5 transition hover:border-good active:border-good">
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
      </section>
    </main>
  );
}
