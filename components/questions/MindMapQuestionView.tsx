"use client";

import { useEffect, useMemo, useState } from "react";
import type { MindMapNode, MindMapQuestion, QuestionAttemptState } from "@/domain/entities/question";
import { shuffleChoices } from "@/lib/choiceShuffle";

type MindMapQuestionViewProps = Readonly<{
  question: MindMapQuestion;
  attempt: QuestionAttemptState;
  disabled: boolean;
  onAnswer: (answerId: string) => void;
}>;

type MindMapTree = Readonly<{
  root: MindMapNode;
  branches: MindMapBranch[];
}>;

type MindMapBranch = Readonly<{
  node: MindMapNode;
  details: MindMapNode[];
}>;

type RenderState = Readonly<{
  targetFilled: boolean;
  correctLabel: string | undefined;
  highlighted: boolean;
}>;

export function MindMapQuestionView({ question, attempt, disabled, onAnswer }: MindMapQuestionViewProps) {
  const choices = useMemo(
    () => shuffleChoices(question.choices, `${attempt.levelAttemptId}:${question.id}:${attempt.encounters}`),
    [attempt.encounters, attempt.levelAttemptId, question.choices, question.id]
  );
  const correctChoice = choices.find((choice) => choice.isCorrect);
  const [activeChoiceId, setActiveChoiceId] = useState<string | null>(null);
  const targetFilled = attempt.eventuallyCorrect || Boolean(attempt.revealedAnswerId);
  const tree = useMemo(() => buildMindMapTree(question.nodes), [question.nodes]);
  const renderState = {
    targetFilled,
    correctLabel: correctChoice?.label,
    highlighted: Boolean(activeChoiceId) && !targetFilled && !disabled
  };

  useEffect(() => {
    function chooseByKeyboard(event: KeyboardEvent) {
      if (disabled || attempt.status === "completed") return;
      const choiceIndex = Number(event.key) - 1;
      const choice = choices[choiceIndex];
      if (!choice || attempt.selectedAnswerIds.includes(choice.id)) return;
      onAnswer(choice.id);
    }

    globalThis.addEventListener("keydown", chooseByKeyboard);
    return () => globalThis.removeEventListener("keydown", chooseByKeyboard);
  }, [attempt.selectedAnswerIds, attempt.status, choices, disabled, onAnswer]);

  return (
    <section className="grid gap-5" aria-labelledby="mindmap-prompt">
      <h2 id="mindmap-prompt" className="text-[1.45rem] font-semibold leading-tight sm:text-2xl">{question.prompt}</h2>

      <div className="rounded-lg bg-ink/80 p-3 sm:p-5" aria-label="Mind map with one missing concept">
        <DesktopMindMap tree={tree} renderState={renderState} />
        <MobileMindMap tree={tree} renderState={renderState} />
      </div>

      <div className="grid gap-3" aria-label="Choose the missing concept">
        <p className="text-sm font-medium text-slate-300">Choose the missing concept</p>
        <div className="grid gap-3 md:grid-cols-3">
          {choices.map((choice, index) => (
            <MindMapChoiceButton
              key={choice.id}
              id={choice.id}
              index={index}
              label={choice.label}
              disabled={disabled || attempt.selectedAnswerIds.includes(choice.id) || attempt.status === "completed"}
              selected={attempt.selectedAnswerIds.includes(choice.id)}
              correct={choice.isCorrect}
              revealed={attempt.revealedAnswerId === choice.id || (attempt.eventuallyCorrect && choice.isCorrect)}
              onChoose={onAnswer}
              onActivate={setActiveChoiceId}
            />
          ))}
        </div>
      </div>

      <StatusText attempt={attempt} />
    </section>
  );
}

function DesktopMindMap({ tree, renderState }: Readonly<{ tree: MindMapTree; renderState: RenderState }>) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <div className="mx-auto min-w-[680px] max-w-5xl px-4 py-3">
        <div className="flex justify-center">
          <MapNode node={tree.root} depth={0} renderState={renderState} />
        </div>

        {tree.branches.length > 0 ? (
          <>
            <div className="mx-auto h-8 w-px bg-good/60" />
            <div className="relative mx-auto h-8" style={{ width: `${Math.max(1, tree.branches.length - 1) * 230}px` }}>
              <div className="absolute left-0 right-0 top-0 h-px bg-line" />
              <div className="absolute left-0 top-0 h-8 w-px bg-line" />
              <div className="absolute right-0 top-0 h-8 w-px bg-line" />
            </div>
            <div
              className="grid items-start gap-8"
              style={{ gridTemplateColumns: `repeat(${tree.branches.length}, minmax(190px, 1fr))` }}
            >
              {tree.branches.map((branch) => (
                <DesktopBranch key={branch.node.id} branch={branch} renderState={renderState} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function DesktopBranch({ branch, renderState }: Readonly<{ branch: MindMapBranch; renderState: RenderState }>) {
  return (
    <div className="grid justify-items-center">
      <MapNode node={branch.node} depth={1} renderState={renderState} />
      {branch.details.length > 0 ? <div className="h-8 w-px bg-line" /> : null}
      <div className="grid gap-3">
        {branch.details.map((detail) => (
          <MapNode key={detail.id} node={detail} depth={2} renderState={renderState} />
        ))}
      </div>
    </div>
  );
}

function MobileMindMap({ tree, renderState }: Readonly<{ tree: MindMapTree; renderState: RenderState }>) {
  return (
    <div className="grid gap-4 md:hidden">
      <div className="flex justify-center">
        <MapNode node={tree.root} depth={0} renderState={renderState} />
      </div>
      <div className="mx-auto h-6 w-px bg-good/60" />
      <div className="relative grid gap-4 pl-5 before:absolute before:bottom-8 before:left-2 before:top-0 before:w-px before:bg-line">
        {tree.branches.map((branch) => (
          <div key={branch.node.id} className="relative grid gap-3 before:absolute before:left-[-0.75rem] before:top-7 before:h-px before:w-3 before:bg-line">
            <MapNode node={branch.node} depth={1} renderState={renderState} />
            <div className="grid gap-3 pl-5">
              {branch.details.map((detail) => (
                <div key={detail.id} className="relative before:absolute before:left-[-0.75rem] before:top-6 before:h-px before:w-3 before:bg-line">
                  <MapNode node={detail} depth={2} renderState={renderState} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapNode({ node, depth, renderState }: Readonly<{ node: MindMapNode; depth: number; renderState: RenderState }>) {
  const label = getNodeLabel(node, renderState);

  return (
    <div className={getNodeClassName(node.isTarget, depth, renderState.highlighted)}>
      {node.isTarget && !renderState.targetFilled ? <span className="text-xl leading-none text-good">?</span> : null}
      <span className="block text-pretty text-center [overflow-wrap:anywhere]">{label}</span>
    </div>
  );
}

type MindMapChoiceButtonProps = Readonly<{
  id: string;
  index: number;
  label: string;
  disabled: boolean;
  selected: boolean;
  correct: boolean;
  revealed: boolean;
  onChoose: (id: string) => void;
  onActivate: (id: string | null) => void;
}>;

function MindMapChoiceButton({ id, index, label, disabled, selected, correct, revealed, onChoose, onActivate }: MindMapChoiceButtonProps) {
  const stateClass = getChoiceStateClass({ revealed, correct, selected });

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      aria-pressed={selected}
      onClick={() => onChoose(id)}
      onMouseEnter={() => onActivate(id)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(id)}
      onBlur={() => onActivate(null)}
      className={`grid min-h-16 grid-cols-[2rem_1fr] items-center gap-3 rounded-lg border px-4 py-3 text-left text-[0.95rem] leading-5 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 ${stateClass}`}
    >
      <span className="grid size-8 place-items-center rounded-md border border-current/30 text-sm font-semibold">{index + 1}</span>
      <span className="text-pretty [overflow-wrap:anywhere]">{label}</span>
    </button>
  );
}

function buildMindMapTree(nodes: MindMapNode[]): MindMapTree {
  const nodesByParent = groupNodesByParent(nodes);
  const root = nodesByParent.get("root")?.[0] ?? nodes.find((node) => node.parentId === null) ?? nodes[0];
  const branches = (nodesByParent.get(root?.id ?? "") ?? nodes.filter((node) => node.parentId === root?.id)).map((node) => ({
    node,
    details: nodesByParent.get(node.id) ?? []
  }));

  return { root, branches };
}

function groupNodesByParent(nodes: MindMapNode[]) {
  const groups = new Map<string, MindMapNode[]>();
  for (const node of nodes) {
    const key = node.parentId ?? "root";
    groups.set(key, [...(groups.get(key) ?? []), node]);
  }
  return groups;
}

function getNodeLabel(node: MindMapNode, renderState: RenderState) {
  if (!node.isTarget) return node.label ?? "";
  if (renderState.targetFilled) return renderState.correctLabel ?? "";
  return "Select the missing concept";
}

function getNodeClassName(isTarget: boolean, depth: number, highlighted: boolean) {
  const base = "grid place-items-center rounded-lg border px-4 text-center shadow-sm transition";
  if (isTarget) {
    return `${base} min-h-[60px] w-full max-w-[220px] border-dashed ${highlighted ? "border-good bg-good/20 shadow-good/20" : "border-good bg-good/10"} text-[0.95rem] font-semibold leading-5 text-white`;
  }
  if (depth === 0) return `${base} min-h-[72px] w-full max-w-[300px] border-good/70 bg-good/10 text-lg font-semibold leading-6 text-white`;
  if (depth === 1) return `${base} min-h-16 w-full max-w-[220px] border-good/30 bg-panel text-base font-semibold leading-6 text-white`;
  return `${base} min-h-[58px] w-full max-w-[200px] border-line bg-[#0d1119] text-[0.95rem] font-medium leading-5 text-slate-100`;
}

function getChoiceStateClass({ revealed, correct, selected }: Pick<MindMapChoiceButtonProps, "revealed" | "correct" | "selected">) {
  if (revealed && correct) return "border-good bg-good/10";
  if (selected) return "border-warn bg-warn/10";
  return "border-line bg-ink hover:border-good/70 hover:bg-good/5 focus-visible:border-good";
}

function StatusText({ attempt }: Readonly<{ attempt: QuestionAttemptState }>) {
  if (attempt.status === "first_error") return <output className="text-sm text-warn">Try another concept for the empty node.</output>;
  if (attempt.status === "completed" && attempt.eventuallyCorrect) return <output className="text-sm text-good">Correct.</output>;
  if (attempt.status === "completed" && !attempt.eventuallyCorrect) return <output className="text-sm text-bad">Answer revealed.</output>;
  return <output className="sr-only">Mind map active</output>;
}
