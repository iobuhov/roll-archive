import { select } from "@inquirer/prompts";
import {
  developmentProcess,
  dilution,
  exhaustion,
  filmProcessor,
  mixDate,
  time,
} from "./preset-helpers.mjs";
import { promptStruct } from "./utils.mjs";

const bellinic41 = {
  name: "Bellini C41 kit 1L",
  type: "C-41",
  developmentProcess,
  filmProcessor,
  chemicals: {
    developer: {
      name: "Bellini kit developer",
      mixDate: mixDate("developer"),
      dilution: dilution("developer"),
      exhaustion: exhaustion("developer"),
    },
    bleach: {
      name: "Bellini kit bleach",
      mixDate: mixDate("bleach"),
      dilution: dilution("bleach"),
      exhaustion: exhaustion("bleach"),
    },
    fixer: {
      name: "Bellini kit fixer",
      mixDate: mixDate("fixer"),
      dilution: dilution("fixer"),
      exhaustion: exhaustion("fixer"),
    },
    stabilizer: {
      name: "Bellini kit stabilizer",
      mixDate: mixDate("stabilizer"),
      dilution: dilution("stabilizer"),
      exhaustion: exhaustion("stabilizer"),
    },
  },
  steps: [
    { name: "Developer", time: time("developer") },
    { name: "Bleach", time: time("bleach") },
    { name: "Fixer", time: time("fixer") },
    { name: "Stabilizer", time: time("stabilizer") },
  ],
};

const presets = [bellinic41];

export const presetPrompt = async () => {
  const preset = await select({
    message: "Preset",
    choices: presets.map((p) => ({ name: p.name, value: p })),
  });

  return await promptStruct(preset);
};
