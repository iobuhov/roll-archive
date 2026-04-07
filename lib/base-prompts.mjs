import {
  promptInput,
  promptNumber,
  promptSelect,
  promptSearch,
} from "./prompts.mjs";
import { filmStocks, lenses, cameras } from "./data.mjs";
import { fmsg } from "./utils.mjs";

export const cmd = () =>
  promptSelect(fmsg("Choose action"), [
    { name: "Add roll meta", value: "roll" },
    { name: "Add process", value: "proc" },
  ]);

export const year = () =>
  promptInput(fmsg("Enter year please"), new Date().getFullYear());

export const rollId = () => promptInput(fmsg("Roll id please"));

export const filmStock = async () => {
  const maker = await promptSearch(
    fmsg("Film maker please"),
    Object.keys(filmStocks),
  );
  const stock = await promptSearch(
    fmsg("Film stock please"),
    filmStocks[maker],
  );
  return stock;
};

export const iso = () => promptNumber(fmsg("Box speed"), 400);

export const exposureIndex = () =>
  promptNumber(fmsg("Exposure index (EL)"), 400);

export const description = () => promptInput(fmsg("Description please"));

export const filmFormat = () => promptNumber(fmsg("Film format please"), 135);

export const loaded = () =>
  promptInput(fmsg("Loaded date please (yyyy-mm-dd)"));

export const unloaded = () =>
  promptInput(fmsg("Unloaded date please (yyyy-mm-dd)"));

export const developed = () =>
  promptInput(fmsg("Developed date please (yyyy-mm-dd)"));

export const camera = () =>
  promptSearch(
    fmsg("Camera please"),
    cameras.map((x) => ({ name: x.join(" "), value: x })),
  );

export const lens = () =>
  promptSearch(
    fmsg("Lens please"),
    lenses.map(([_, name]) => ({ name, value: name })),
  );

export const framesShot = () => promptNumber(fmsg("Frames shot"));

export const location = () => promptInput(fmsg("Location"));

export const developedAt = () =>
  promptSelect(fmsg("Developed at"), ["Lab", "Home"], "Home");

export const notes = () => promptInput(fmsg("Notes"), "-");
