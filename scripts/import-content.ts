import { readFile } from "node:fs/promises";
import { prisma } from "@/infrastructure/database/prisma";
import { ContentImportService } from "@/lib/importService";

const filePath = process.argv[2] ?? "content/sonar-products-learning.json";

const raw = JSON.parse(await readFile(filePath, "utf8")) as unknown;
const result = await new ContentImportService(prisma).import(raw);
console.log(`Imported ${result.topics} topics, ${result.levels} levels, ${result.questions} questions from ${filePath}.`);
await prisma.$disconnect();
