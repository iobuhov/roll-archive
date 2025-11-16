import { input, search, number, select } from "@inquirer/prompts";
import { filmStocks, lenses, cameras } from "./data.mjs";
import { fmsg, starts } from "./utils.mjs";

export const cmd = () =>
  select({
    message: fmsg("Choose action"),
    choices: [
      { name: "Add roll meta", value: "roll" },
      { name: "Add process", value: "proc" },
    ],
  });

export const year = () =>
  input({
    message: fmsg("Enter year please"),
    default: `${new Date().getFullYear()}`,
  });

export const month = () =>
  input({
    message: fmsg("Enter month please (01, 02, ...)"),
    default: `${new Date().getMonth() + 1}`.padStart(2, "0"),
  });

export const rollId = () => input({ message: fmsg("Roll id please") });

export const filmStock = async () => {
  const filmMakers = Object.keys(filmStocks);

  const maker = await search({
    message: fmsg("Film maker please"),
    source: (input) => filmMakers.filter((x) => starts(x, input ?? "")),
  });

  const stock = await search({
    message: fmsg("Film stock please"),
    source: (input) => {
      const items = filmStocks[maker];

      return items.filter((x) => starts(x, input ?? ""));
    },
  });

  return `${maker} ${stock}`;
};

export const iso = () => number({ message: fmsg("Box speed"), default: 400 });

export const exposureIndex = () =>
  number({ message: fmsg("Exposure index (EL)"), default: 400 });

export const description = () => input({ message: fmsg("Description please") });

export const filmFormat = () =>
  number({ message: fmsg("Film format please"), default: 135 });

export const loaded = () =>
  input({ message: fmsg("Loaded date please (yyyy-mm-dd)") });

export const unloaded = () =>
  input({ message: fmsg("Unloaded date please (yyyy-mm-dd)") });

export const developed = () =>
  input({ message: fmsg("Developed date please (yyyy-mm-dd)") });

export const camera = () => {
  const camerasArr = cameras.map((x) => ({
    name: x.join(" "),
    value: x,
  }));

  return search({
    message: fmsg("Camera please"),
    source: (input) => {
      return camerasArr.filter((x) => starts(x.name, input ?? ""));
    },
  });
};

export const lens = () => {
  const lensArr = lenses.map(([_, name]) => ({
    name,
    value: name,
  }));

  return search({
    message: fmsg("Lens please"),
    source: (input) => {
      return lensArr.filter((x) => starts(x.name, input ?? ""));
    },
  });
};

export const framesShot = () => number({ message: fmsg("Frames shot") });

export const location = () => input({ message: fmsg("Location") });

export const developedAt = () =>
  select({
    message: fmsg("Developed at"),
    choices: ["Lab", "Home"],
    default: "Home",
  });

export const notes = () => input({ message: fmsg("Notes"), default: "-" });
