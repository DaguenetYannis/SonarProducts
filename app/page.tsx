import { LearningHome, LevelList } from "@/components/learning/LevelList";
import { listStaticLevels } from "@/lib/staticLearningContent";

export const dynamic = "force-static";

export default function HomePage() {
  const levels = listStaticLevels();

  return (
    <LearningHome
      eyebrow="Mobile learning"
      title="Sonar Products"
      description="Study Sonar products, governance concepts, and CSE interview scenarios in short levels that work well on a phone."
    >
      <LevelList levels={levels} hrefForLevel={(level) => `/offline/levels/${level.id}`} />
    </LearningHome>
  );
}
