import Fuse from "fuse.js";
import { search, input, select, confirm, number } from "@inquirer/prompts";
import { fmsg } from "./utils.mjs";
import { $process } from "./datastorage.mjs";

const STEPS = [
  { value: "HEAT" },
  { value: "DEV" },
  { value: "BLEA" },
  { value: "WASH" },
  { value: "FIX" },
  { value: "STAB" },
  { value: "RINSE" },
  { value: "BLIX" },
  { value: "PRE" },
  { value: "REMJ_REMOVAL" },
  { value: "Other" },
];

const CHEMICALS = [
  { value: "510 Pyro" },
  { value: "Adox Adonal" },
  { value: "Adox C-41 BLIX" },
  { value: "Adox C-41 DEV" },
  { value: "Adox XT-3" },
  { value: "Bellini C-41 BLEA" },
  { value: "Bellini C-41 DEV" },
  { value: "Bellini C-41 FIX" },
  { value: "Bellini C-41 STAB" },
  { value: "Bellini Remjet Removal Agent PRE" },
  { value: "Flic Film C-41 BLEA" },
  { value: "Flic Film C-41 DEV" },
  { value: "Flic Film C-41 FIX" },
  { value: "Ilford ID-11" },
  { value: "Ilford Ilfotol" },
  { value: "Ilford Rapid Fixer" },
  { value: "Kodak C-41 BLEA" },
  { value: "Kodak C-41 DEV" },
  { value: "Kodak C-41 FIX" },
  { value: "Kodak C-41 STAB" },
];

const $index = {
  stepName: new Fuse(STEPS, { keys: ["value"] }),
  chemical: new Fuse(CHEMICALS, { keys: ["value"] }),
};

export const processType = () =>
  select({
    message: fmsg("Process type"),
    choices: ["B&W", "C-41"],
    default: "C-41",
  });

export const automaticFilmProcessor = () =>
  select({
    message: fmsg("Automatic film processor"),
    choices: [{ name: "None", value: null }, { value: "AGO Film Processor" }],
    default: "AGO Film Processor",
  });

export const stepAgitation = async () => {
  return await select({
    message: fmsg("Agitation"),
    choices: [
      { value: null, name: "None" },
      { value: "Manual" },
      { value: "Roll" },
      { value: "Stand-Stick" },
      { value: "Stand" },
    ],
    default: "Roll",
  });
};

export const stepAgitationDetails = async (agitation) => {
  const details = {
    Manual: "4 inversions first 10s then 10s every minute",
    Roll: "SP=60,T1=15,T2=15",
    Stick: "SP=60,T1=60,T2=10",
    "Stand-Stick": "SP=60,T1=30',T2=60,T3=30",
    Stand: undefined,
  };

  return await input({
    message: fmsg("Details"),
    default: details[agitation],
  });
};

export const stepName = async () => {
  const answer = await search({
    message: fmsg("Step"),
    source: async (input = "") => {
      if (input === "") {
        return STEPS;
      }
      return $index.stepName.search(input).map((x) => x.item);
    },
  });

  if (answer === "Other") {
    return await input({ message: fmsg("Step name") });
  }

  return answer;
};

export const stepTime = async () => {
  const format = (str) => {
    const [m, s = "00"] = str.split(" ");
    return `${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
  };
  const t = await input({
    message: fmsg("Step time please"),
    transformer: (ans, { isFinal }) => {
      if (isFinal) {
        return format(ans);
      }
      return ans;
    },
  });

  return format(t);
};

export async function step() {
  const data = {};
  data.name = await stepName();
  data.time = await stepTime();
  data.temperature = await number({
    message: fmsg("Temperature (°C)"),
    default: 38,
  });
  data.agitation = await stepAgitation();
  if (data.agitation) {
    data.agitationDetails = await stepAgitationDetails(data.agitation);
  }
  return data;
}

export async function chemicalName() {
  return await search({
    message: fmsg("Chemical"),
    source: async (input = "") => {
      if (input === "") {
        return CHEMICALS;
      }
      return $index.chemical.search(input).map((x) => x.item);
    },
  });
}

export async function chemical() {
  const data = {};

  data.type = await select({
    message: fmsg("Chemical type"),
    choices: ["PRE", "DEV", "BLEA", "BLIX", "FIX", "STAB"],
  });

  data.name = await chemicalName();

  data.mixType = await select({
    message: fmsg("Mix type"),
    choices: ["ONESHOT", "STOCK", "PREMADE"],
    default: "STOCK",
  });

  if (data.mixType === "STOCK") {
    data.stockMixDate =
      (await input({ message: fmsg("Mixed (yyyy-mm-dd)") })) || null;
    data.used = await number({ message: fmsg("Used (rolls)"), default: 0 });
  }

  if (data.mixType === "PREMADE") {
    data.openedDate =
      (await input({ message: fmsg("Opened (yyyy-mm-dd)") })) || null;
    data.used = await number({ message: fmsg("Used (rolls)"), default: 0 });
  }

  if (data.mixType === "ONESHOT") {
    data.madeFrom = await select({
      message: fmsg("Made from"),
      choices: ["STOCK", "CONCENTRATE"],
    });
    if (data.madeFrom === "STOCK") {
      data.stockMixDate =
        (await input({ message: fmsg("Stock mix date (yyyy-mm-dd)") })) || null;
    }
    data.dilution = await input({ message: fmsg("Dilution") });
  }

  data.volume = await number({ message: fmsg("Volume (ml)"), default: 1000 });

  return data;
}

async function getCopy() {
  const list = await $process.list();
  const choices = list.map((item) => ({ name: item, value: item }));
  const index = new Fuse(choices, { keys: ["name"] });
  const item = await search({
    message: "Saved copy",
    source: async (input = "") => {
      if (input === "") {
        return choices;
      }
      return index.search(input).map((x) => x.item);
    },
  });

  return await $process.get(item);
}

async function saveCopy(copy) {
  await $process.save(copy);
}

export async function filmProcess() {
  const data = { id: null };

  data.date = await input({ message: fmsg("Developing date (yyyy-mm-dd)") });
  data.processType = await processType();
  data.automaticFilmProcessor = await automaticFilmProcessor();
  data.compensation = await input({
    message: fmsg("Compensation"),
    default: "+0",
  });

  let addRoll = true;
  data.rolls = [];
  while (addRoll) {
    data.rolls.push(await input({ message: fmsg("Roll id") }));
    addRoll = await confirm({ message: fmsg("Add roll?") });
  }

  data.id = `${data.date}_${data.rolls.join("_")}`;

  let addStep = true;
  data.steps = [];
  while (addStep) {
    const s = await step();
    data.steps.push(s);
    addStep = await confirm({ message: fmsg("Add step?") });
  }

  let addChem = true;
  data.chemicals = [];
  while (addChem) {
    const c = await chemical();
    data.chemicals.push(c);
    addChem = await confirm({ message: fmsg("Add chemical?") });
  }

  let note = await confirm({ message: "Add note?" });

  data.notes = [];
  while (note) {
    data.notes.push(await input({ message: fmsg("Note") }));
    note = await confirm({ message: "Add one more note?" });
  }

  await saveCopy(data);

  return data;
}
