import { select, input } from "@inquirer/prompts";
import {
  developmentProcess,
  filmProcessor,
  developer,
  bleach,
  fixer,
  stabilizer,
} from "./preset-helpers.mjs";
import { promptStruct } from "./utils.mjs";

const bellinic41 = {
  name: "Bellini C41 kit 1L",
  type: "C-41",
  developmentProcess,
  filmProcessor,
  chemicals: {
    developer,
    bleach,
    fixer,
    stabilizer,
  },
  steps: [
    {
      name: "Developer",
      time: () => input({ message: "Developer time", default: "03:30" }),
    },
    {
      name: "Bleach",
      time: () => input({ message: "Bleach time", default: "00:45" }),
    },
    {
      name: "Fixer",
      time: () => input({ message: "Fixer time", default: "01:30" }),
    },
    {
      name: "Stabilizer",
      time: () => input({ message: "Stabilizer time", default: "03:00" }),
    },
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
