import { input, search, number, select } from "@inquirer/prompts";
import { filmStocks, lenses, cameras } from "./data.mjs";
import { starts } from "./utils.mjs";

export const cmd = () =>
  select({
    message: "Choose action",
    choices: [
      { name: "Add meta", value: "roll" },
      { name: "Add chemical", value: "ch" },
    ],
  });

export const year = () =>
  input({
    message: "Enter year please",
    default: `${new Date().getFullYear()}`,
  });

export const month = () =>
  input({
    message: "Enter month please (01, 02, ...)",
    default: `${new Date().getMonth() + 1}`.padStart(2, "0"),
  });

export const rollId = () => input({ message: "Roll id please" });

export const filmStock = async () => {
  const filmMakers = Object.keys(filmStocks);

  const maker = await search({
    message: "Film maker pleae",
    source: (input) => filmMakers.filter((x) => starts(x, input ?? "")),
  });

  const stock = await search({
    message: "Film stock please",
    source: (input) => {
      const items = filmStocks[maker];

      return items.filter((x) => starts(x, input ?? ""));
    },
  });

  return `${maker} ${stock}`;
};

export const iso = () => number({ message: "ISO", default: 400 });

export const pullPush = () => input({ message: "push/pull?", default: "+0" });

export const description = () => input({ message: "Description please" });

export const loaded = () =>
  input({ message: "Loaded date please (yyyy-mm-dd)" });

export const developed = () =>
  input({ message: "Developed date please (yyyy-mm-dd)" });

export const camera = () => {
  const camerasArr = cameras.map((x) => ({
    name: x.join(" "),
    value: x,
  }));

  return search({
    message: "Camera please",
    source: (input) => {
      return camerasArr.filter((x) => starts(x.name, input ?? ""));
    },
  });
};

export const lens = () => {
  const lensArr = lenses.map((x) => ({ name: x.join(" "), value: x }));

  return search({
    message: "Lens please",
    source: (input) => {
      return lensArr.filter((x) => starts(x.name, input ?? ""));
    },
  });
};

export const firstFrame = () =>
  input({ message: "First frame (00, 0, 1, ...)", default: "0" });

export const lastFrame = () => input({ message: "Last frame", default: "37" });

export const location = () => input({ message: "Location" });
