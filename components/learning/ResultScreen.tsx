"use client";

import Link from "next/link";
import type { LevelResult } from "@/domain/entities/question";

type ResultScreenProps = Readonly<{
  result: LevelResult;
  onRetry: () => void;
  homeHref?: string;
}>;

type MetricProps = Readonly<{
  label: string;
  value: string | number;
}>;

export function ResultScreen({ result, onRetry, homeHref = "/" }: ResultScreenProps) {
  return (
    <section className="grid gap-5 rounded-lg border border-line bg-panel p-4 text-center sm:p-6">
      <h2 className="text-2xl font-semibold leading-tight">Level complete</h2>
      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <Metric label="Questions" value={result.totalQuestions} />
        <Metric label="Clean correct" value={result.correctWithoutError} />
        <Metric label="After error" value={result.correctAfterOneError} />
        <Metric label="Failed" value={result.failed} />
        <Metric label="Errors" value={result.totalErrors} />
        <Metric label="Completion" value={`${result.completionPercentage}%`} />
      </dl>
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={onRetry} className="min-h-12 rounded-lg border border-good bg-good/10 px-4 py-3 font-medium">Retry level</button>
        <Link href={homeHref} className="min-h-12 rounded-lg border border-line bg-ink px-4 py-3 font-medium">Return to levels</Link>
      </div>
    </section>
  );
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-lg border border-line bg-ink p-3">
      <dt className="text-slate-400">{label}</dt>
      <dd className="mt-1 text-xl font-semibold">{value}</dd>
    </div>
  );
}
