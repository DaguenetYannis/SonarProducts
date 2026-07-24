"use client";

export function ProgressHeader({ title, topics, current, total }: { title: string; topics: string[]; current: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);
  return (
    <header className="grid gap-3">
      <div className="grid gap-3 sm:flex sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-good">{topics.join(", ")}</p>
          <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
        </div>
        <p className="w-fit rounded-full border border-line px-3 py-1 text-sm text-slate-300">{Math.min(current, total)} / {total}</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line" aria-label="Level progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="h-full bg-good transition-all" style={{ width: `${percent}%` }} />
      </div>
    </header>
  );
}
