import { join, format, parse } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import {
  input,
  search,
  select,
  confirm,
  number,
  rawlist,
} from "@inquirer/prompts";
import { starts } from "./utils.mjs";

export const developers = ["Bellini C41 kit developer", "Ilford ID 11"];

export const developmentProcess = () =>
  rawlist({
    message: "Development process",
    choices: ["Standard", "Rotary", "Stand development"],
  });

export const steps = [
  "Pre heat",
  "Developer",
  "Bleach",
  "Fixer",
  "Stabilizer",
  "Rinse",
];

export const developer = () =>
  search({
    message: "Developer",
    source: (input) => developers.filter((x) => x.starts(x, input ?? "")),
  });

export const mixDate = (name) => () =>
  input({
    message: `${name} | Mix date (yyyy-mm-dd)`,
  });

export const exhaustion = (name) => () =>
  number({
    message: `${name} | Exhaustion`,
    default: 0,
  });

export const dilution = (name) => () =>
  input({
    message: `${name} | Dilution (n+m)`,
  });

export const time = (name) => () =>
  input({
    message: `${name} | Time (min:sec)`,
  });

export const filmProcessor = () =>
  rawlist({
    message: "Film processor",
    choices: ["None", "AGO Film Processor"],
  });
