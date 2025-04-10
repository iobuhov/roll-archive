import Fuse from "fuse.js";
import { select, search, confirm, input, number } from "@inquirer/prompts";
import { chemicals } from "./datastorage.mjs";
import { promptStruct } from "./utils.mjs";

const baseChemical = () =>
  promptStruct({
    type: chemType,
    name,
    mixDate,
    dilution,
  });

export const addChem = async () => {
  const list = await chemicals.get();
  const newItem = await baseChemical();
  const save = await confirm({ message: "Save new item?" });
  if (save) {
    chemicals.set([...list, newItem]);
  }
  return newItem;
};

export const chemicalPrompt = async (searchOptions = {}) => {
  const list = await chemicals.get();
  const index =
    list.length > 0 ? new Fuse(list, { keys: ["name", "mixDate"] }) : null;

  const toChoice = (item) => ({
    name: `${item.name} ${item.dilution} [${item.mixDate}]`,
    value: item,
  });

  const source = async (input = "") => {
    const add = { name: "Add new", value: "new" };
    if (index === null) {
      return [add];
    }
    if (input === "") {
      return [add, ...list.map(toChoice)];
    }
    const items = index.search(input).map((x) => toChoice(x.item));
    return [...items];
  };

  const answer = await search({
    message: "Choose chemical",
    ...searchOptions,
    source,
  });

  if (answer === "new") {
    return await addChem();
  } else {
    return answer;
  }
};

export const chemType = () =>
  select({
    message: "Type",
    choices: ["developer", "bleach", "fixer", "stabilizer", "stopbath"],
  });

const name = () => input({ message: "Name" });

export const mixDate = () =>
  input({
    message: "Mix date (yyyy-mm-dd)",
  });

export const exhaustion = () =>
  number({
    message: "Exhaustion",
    default: 0,
  });

export const dilution = () =>
  input({
    message: "Dilution (n+m)",
  });
