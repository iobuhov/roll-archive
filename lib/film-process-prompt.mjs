import {
  promptInput,
  promptNumber,
  promptSelect,
  promptSearch,
  promptConfirm,
} from "./prompts.mjs";
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
  { value: "Adox C-41 STAB" },
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

export const processType = () =>
  promptSelect(fmsg("Process type"), ["B&W", "C-41"], "C-41");

export const automaticFilmProcessor = () =>
  promptSelect(
    fmsg("Automatic film processor"),
    [{ name: "None", value: null }, { value: "AGO Film Processor" }],
    "AGO Film Processor",
  );

export const stepAgitation = () =>
  promptSelect(
    fmsg("Agitation"),
    [
      { value: null, name: "None" },
      { value: "Manual" },
      { value: "Roll" },
      { value: "Stand-Stick" },
      { value: "Stand" },
    ],
    "Roll",
  );

export const stepAgitationDetails = (agitation) => {
  const details = {
    Manual: "4 inversions first 10s then 10s every minute",
    Roll: "SP=60,T1=15,T2=15",
    Stick: "SP=60,T1=60,T2=10",
    "Stand-Stick": "SP=60,T1=30',T2=60,T3=30",
    Stand: undefined,
  };
  return promptInput(fmsg("Details"), details[agitation]);
};

export const stepName = async () => {
  const answer = await promptSearch(fmsg("Step"), STEPS);
  if (answer === "Other") {
    return promptInput(fmsg("Step name"));
  }
  return answer;
};

export const stepTime = async () => {
  const format = (str) => {
    const [m, s = "00"] = str.split(" ");
    return `${m.padStart(2, "0")}:${s.padStart(2, "0")}`;
  };
  const t = await promptInput(fmsg("Step time please"));
  return format(t);
};

export async function step() {
  const data = {};
  data.name = await stepName();
  data.time = await stepTime();
  data.temperature = await promptNumber(fmsg("Temperature (°C)"), 38);
  data.agitation = await stepAgitation();
  if (data.agitation) {
    data.agitationDetails = await stepAgitationDetails(data.agitation);
  }
  return data;
}

export async function chemicalName() {
  return promptSearch(fmsg("Chemical"), CHEMICALS);
}

export async function chemical() {
  const data = {};

  data.type = await promptSelect(fmsg("Chemical type"), [
    "PRE",
    "DEV",
    "BLEA",
    "BLIX",
    "FIX",
    "STAB",
  ]);

  data.name = await chemicalName();

  data.mixType = await promptSelect(
    fmsg("Mix type"),
    ["ONESHOT", "STOCK", "PREMADE"],
    "STOCK",
  );

  if (data.mixType === "STOCK") {
    data.stockMixDate =
      (await promptInput(fmsg("Mixed (yyyy-mm-dd)"))) || null;
    data.used = await promptNumber(fmsg("Used (rolls)"), 0);
  }

  if (data.mixType === "PREMADE") {
    data.openedDate =
      (await promptInput(fmsg("Opened (yyyy-mm-dd)"))) || null;
    data.used = await promptNumber(fmsg("Used (rolls)"), 0);
  }

  if (data.mixType === "ONESHOT") {
    data.madeFrom = await promptSelect(fmsg("Made from"), [
      "STOCK",
      "CONCENTRATE",
    ]);
    if (data.madeFrom === "STOCK") {
      data.stockMixDate =
        (await promptInput(fmsg("Stock mix date (yyyy-mm-dd)"))) || null;
    }
    data.dilution = await promptInput(fmsg("Dilution"));
  }

  data.volume = await promptNumber(fmsg("Volume (ml)"), 1000);

  return data;
}

async function getCopy() {
  const list = await $process.list();
  const item = await promptSearch(
    "Saved copy",
    list.map((x) => ({ name: x, value: x })),
  );
  return $process.get(item);
}

async function saveCopy(copy) {
  await $process.save(copy);
}

export async function filmProcess() {
  const data = { id: null };

  data.date = await promptInput(fmsg("Developing date (yyyy-mm-dd)"));
  data.processType = await processType();
  data.automaticFilmProcessor = await automaticFilmProcessor();
  data.compensation = await promptInput(fmsg("Compensation"), "+0");

  let addRoll = true;
  data.rolls = [];
  while (addRoll) {
    data.rolls.push(await promptInput(fmsg("Roll id")));
    addRoll = await promptConfirm(fmsg("Add roll?"));
  }

  data.id = `${data.date}_${data.rolls.join("_")}`;

  let addStep = true;
  data.steps = [];
  while (addStep) {
    data.steps.push(await step());
    addStep = await promptConfirm(fmsg("Add step?"));
  }

  let addChem = true;
  data.chemicals = [];
  while (addChem) {
    data.chemicals.push(await chemical());
    addChem = await promptConfirm(fmsg("Add chemical?"));
  }

  let note = await promptConfirm("Add note?");
  data.notes = [];
  while (note) {
    data.notes.push(await promptInput(fmsg("Note")));
    note = await promptConfirm("Add one more note?");
  }

  await saveCopy(data);

  return data;
}
