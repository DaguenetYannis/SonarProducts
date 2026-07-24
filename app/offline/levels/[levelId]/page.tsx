import Link from "next/link";
import { LearningSession } from "@/components/learning/LearningSession";
import { getStaticLevelContent, listStaticLevels } from "@/lib/staticLearningContent";

type OfflineLevelPageProps = Readonly<{
  params: Promise<{ levelId: string }>;
}>;

export const dynamic = "force-static";

export function generateStaticParams() {
  return listStaticLevels().map((level) => ({ levelId: level.id }));
}

export default async function OfflineLevelPage({ params }: OfflineLevelPageProps) {
  const { levelId } = await params;
  const level = getStaticLevelContent(levelId);

  if (!level) {
    return (
      <main className="grid min-h-dvh place-items-center">
        <section className="max-w-md rounded-lg border border-line bg-panel p-6 text-center">
          <h1 className="text-2xl font-semibold">Level not found</h1>
          <Link href="/offline" className="mt-5 inline-block rounded-lg border border-line bg-ink px-4 py-3">Return to levels</Link>
        </section>
      </main>
    );
  }

  return <LearningSession levelId={level.id} title={level.title} topics={level.topics} questions={level.questions} homeHref="/offline" />;
}
