import { select, input } from "@inquirer/prompts";
import {
  developmentProcess,
  filmProcessor,
  developer,
  bleach,
  fixer,
  stabilizer,
  stabilizerStock,
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
      name: "Wash",
      time: () => input({ message: "Final wash", default: "10:00" }),
    },
    {
      name: "Wetting agent",
      time: "00:30",
    },
  ],
};

const KODAK_C41_KIT = {
  name: "Kodak C-41 Kit",
  type: "C-41",
  developmentProcess,
  filmProcessor,
  chemicals: {
    developer,
    bleach,
    fixer,
    stabilizer: stabilizerStock,
  },
  steps: [
    {
      name: "Heat",
      time: "03:00",
    },
    {
      name: "Developer",
      time: () => input({ message: "Developer time", default: "03:15" }),
    },
    {
      name: "Bleach",
      time: () => input({ message: "Bleach time", default: "06:30" }),
    },
    {
      name: "Wash",
      time: "01:30",
    },
    {
      name: "Fixer",
      time: () => input({ message: "Fixer time", default: "06:30" }),
    },
    {
      name: "Wash",
      tiem: "00:45",
    },
    {
      name: "Wetting agent",
      time: "00:45",
    },
    {
      name: "Final rinse",
      time: "01:30",
    },
  ],
};

const presets = [bellinic41, BWGeneric, KODAK_C41_KIT];

export const presetPrompt = async () => {
  const preset = await select({
    message: "Preset",
    choices: presets.map((p) => ({ name: p.name, value: p })),
  });

  return await promptStruct(preset);
};
