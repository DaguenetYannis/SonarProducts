import { readFile } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { prisma } from "@/infrastructure/database/prisma";
import { ContentImportService } from "@/lib/importService";

const filePath = resolveContentPath(process.argv[2] ?? "content/sonar-products-learning.json");

const raw = JSON.parse(await readFile(filePath, "utf8")) as unknown;
const result = await new ContentImportService(prisma).import(raw);
console.log(`Imported ${result.topics} topics, ${result.levels} levels, ${result.questions} questions from ${filePath}.`);
await prisma.$disconnect();

function resolveContentPath(inputPath: string): string {
  const workspaceRoot = resolve(".");
  const contentPath = resolve(inputPath);

  if (extname(contentPath) !== ".json") {
    throw new Error("Content imports must use a .json file.");
  }

  const relativePath = relative(workspaceRoot, contentPath);
  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    throw new Error("Content imports must stay inside the repository.");
  }

  return contentPath;
}
