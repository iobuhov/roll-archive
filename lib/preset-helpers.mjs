import { select } from "@inquirer/prompts";
import { chemicalPrompt, exhaustion, mixDate } from "./chem-prompts.mjs";

export const developmentProcess = () =>
  select({
    message: "Development process",
    choices: ["Standard", "Rotary", "Stand development"],
  });

export const filmProcessor = () =>
  select({
    message: "Film processor",
    choices: ["None", "AGO Film Processor"],
  });

export const steps = [
  "Pre heat",
  "Developer",
  "Bleach",
  "Fixer",
  "Stabilizer",
  "Rinse",
];

export const developer = async () => {
  const dev = await chemicalPrompt({ message: "Developer" });
  return {
    ...dev,
    exhaustion: await exhaustion(),
  };
};

export const bleach = async () => {
  const bch = await chemicalPrompt({ message: "Bleach" });
  return {
    ...bch,
    exhaustion: await exhaustion(),
  };
};

export const fixer = async () => {
  const fx = await chemicalPrompt({ message: "Fixer" });
  return {
    ...fx,
    exhaustion: await exhaustion(),
  };
};

export const stabilizer = async () => {
  const stb = await chemicalPrompt({ message: "Stabilizer" });
  return {
    ...stb,
    exhaustion: await exhaustion(),
    mixDate: await mixDate(),
  };
};

export const stabilizerStock = async () => {
  const stb = await chemicalPrompt({ message: "Stabilizer" });
  return {
    ...stb,
    exhaustion: await exhaustion(),
  };
};

export const stopbath = async () => {
  const p = await chemicalPrompt({ message: "Stop bath" });
  return {
    ...p,
    exhaustion: await exhaustion(),
  };
};
