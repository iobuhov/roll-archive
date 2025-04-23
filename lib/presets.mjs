import { select, input } from "@inquirer/prompts";
import {
  developmentProcess,
  filmProcessor,
  developer,
  bleach,
  fixer,
  stabilizer,
  stopbath,
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

const BWGeneric = {
  name: "B&W Generic",
  type: "B&W",
  developmentProcess,
  filmProcessor,
  chemicals: {
    developer,
    stopbath,
    fixer,
  },
  steps: [
    {
      name: "Developer",
      time: () => input({ message: "Developer time", default: "05:00" }),
    },
    {
      name: "Stop bath",
      time: () => input({ message: "Stop bath", default: "01:00" }),
    },
    {
      name: "Fixer",
      time: () => input({ message: "Fixer time", default: "05:00" }),
    },
    {
      name: "Final wash",
      time: () => input({ message: "Final wash", default: "10:00" }),
    },
  ],
};

const presets = [bellinic41, BWGeneric];

export const presetPrompt = async () => {
  const preset = await select({
    message: "Preset",
    choices: presets.map((p) => ({ name: p.name, value: p })),
  });

  return await promptStruct(preset);
};
