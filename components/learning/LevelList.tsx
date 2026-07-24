import Link from "next/link";

export interface LevelListItem {
  id: string;
  title: string;
  topics: string[];
  questionCount: number;
}

type LearningHomeProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}>;

type LevelListProps = Readonly<{
  levels: LevelListItem[];
  hrefForLevel: (level: LevelListItem) => string;
}>;

export function LearningHome({ eyebrow, title, description, action, children }: LearningHomeProps) {
  return (
    <main className="min-h-dvh py-8 sm:py-10">
      <section className="mx-auto flex max-w-3xl flex-col gap-7">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-good">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-300">{description}</p>
          {action}
        </div>
        {children}
      </section>
    </main>
  );
}

export function LevelList({ levels, hrefForLevel }: LevelListProps) {
  return (
    <div className="grid gap-3">
      {levels.map((level) => (
        <Link key={level.id} href={hrefForLevel(level)} className="rounded-lg border border-line bg-panel p-5 transition hover:border-good active:border-good">
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
  );
}
