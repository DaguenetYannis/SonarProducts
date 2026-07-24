import { LearningHome, LevelList } from "@/components/learning/LevelList";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { listStaticLevels } from "@/lib/staticLearningContent";

export const dynamic = "force-static";

export default function OfflineHomePage() {
  const levels = listStaticLevels();

  return (
    <LearningHome
      eyebrow="Offline study"
      title="Sonar Products"
      description="Install this mode on your phone and study the bundled Sonar curriculum without a local server."
      action={<InstallAppButton />}
    >
      <LevelList levels={levels} hrefForLevel={(level) => `/offline/levels/${level.id}`} />
    </LearningHome>
  );
}
