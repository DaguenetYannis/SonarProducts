import Link from "next/link";
import { LearningSession } from "@/components/learning/LearningSession";
import { PrismaLearningRepository } from "@/infrastructure/repositories/PrismaLearningRepository";

export default async function LevelPage({ params }: { params: Promise<{ levelId: string }> }) {
  const { levelId } = await params;
  const level = await new PrismaLearningRepository().getLevelContent(levelId);

  if (!level) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <section className="max-w-md rounded-lg border border-line bg-panel p-6 text-center">
          <h1 className="text-2xl font-semibold">Level not found</h1>
          <Link href="/" className="mt-5 inline-block rounded-lg border border-line bg-ink px-4 py-3">Return to levels</Link>
        </section>
      </main>
    );
  }

  if (level.questions.length === 0) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <section className="max-w-md rounded-lg border border-line bg-panel p-6 text-center">
          <h1 className="text-2xl font-semibold">{level.title}</h1>
          <p className="mt-3 text-slate-300">This level exists, but no questions have been imported for it yet.</p>
          <Link href="/" className="mt-5 inline-block rounded-lg border border-line bg-ink px-4 py-3">Return to levels</Link>
        </section>
      </main>
    );
  }

  return <LearningSession levelId={level.id} title={level.title} topics={level.topics} questions={level.questions} />;
}
