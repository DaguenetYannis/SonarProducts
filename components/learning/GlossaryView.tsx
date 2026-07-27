import Link from "next/link";
import { glossaryEntries, glossarySlug, type GlossaryEntry } from "@/lib/glossary";

type GlossaryViewProps = Readonly<{
  homeHref: string;
}>;

export function GlossaryView({ homeHref }: GlossaryViewProps) {
  return (
    <main className="min-h-dvh pb-24 pt-8 sm:pb-28 sm:pt-10">
      <section className="mx-auto grid max-w-4xl gap-7">
        <header className="grid gap-4">
          <Link href={homeHref} className="w-fit rounded-lg border border-line bg-ink px-4 py-3 text-sm font-medium transition hover:border-good">
            Main menu
          </Link>
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-good">Reference</p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Glossary</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Definitions for Sonar products, code quality, security, governance, AI-code verification, and CSE interview vocabulary.
            </p>
          </div>
        </header>

        <nav aria-label="Glossary terms" className="flex flex-wrap gap-2">
          {glossaryEntries.map((entry) => (
            <a key={entry.term} href={`#${glossarySlug(entry.term)}`} className="rounded-full border border-line bg-panel px-3 py-1 text-sm text-slate-200 transition hover:border-good">
              {entry.term}
            </a>
          ))}
        </nav>

        <div className="grid gap-3">
          {glossaryEntries.map((entry) => (
            <article key={entry.term} id={glossarySlug(entry.term)} className="scroll-mt-24 rounded-lg border border-line bg-panel p-5">
              <h2 className="text-xl font-semibold">{entry.term}</h2>
              <p className="mt-3 text-base leading-7 text-slate-300">
                <LinkedDefinition entry={entry} />
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function LinkedDefinition({ entry }: Readonly<{ entry: GlossaryEntry }>) {
  const linkableTerms = glossaryEntries
    .filter((candidate) => candidate.term !== entry.term)
    .sort((first, second) => second.term.length - first.term.length);
  const pattern = new RegExp(`\\b(${linkableTerms.map((candidate) => escapeRegExp(candidate.term)).join("|")})\\b`, "gi");
  const parts = entry.definition.split(pattern).filter(Boolean);

  return parts.map((part, index) => {
    const match = linkableTerms.find((candidate) => candidate.term.toLowerCase() === part.toLowerCase());
    if (!match) return <span key={`${part}-${index}`}>{part}</span>;
    return (
      <a key={`${part}-${index}`} href={`#${glossarySlug(match.term)}`} className="font-medium text-good underline decoration-good/40 underline-offset-4">
        {part}
      </a>
    );
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
