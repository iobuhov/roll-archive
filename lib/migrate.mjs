import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import * as YAML from "yaml";
import { promptInput, promptNumber } from "./prompts.mjs";
import { fmsg } from "./utils.mjs";

export async function convertV1ToMeta(v1) {
  const lens = Array.isArray(v1.lens) ? v1.lens[1] : v1.lens;
  const framesShot =
    v1.lastFrame != null && v1.firstFrame != null
      ? parseInt(v1.lastFrame) - parseInt(v1.firstFrame)
      : 0;

  const exposures = await promptNumber(fmsg("Exposures on roll"), 36);

  const unloaded = await promptInput(
    fmsg("Unloaded date (yyyy-mm-dd, blank to skip)"),
  );

  const pullPushHint =
    v1.pullPush != null && v1.pullPush !== "0"
      ? ` [v1 pullPush: ${v1.pullPush}]`
      : "";
  const exposureIndex = await promptNumber(
    fmsg(`Exposure index (EI)${pullPushHint}`),
    v1.iso,
  );

  const meta = {
    rollId: v1.rollId,
    year: v1.year,
    filmStock: v1.filmStock,
    filmFormat: v1.filmFormat,
    exposures,
    framesShot,
    iso: v1.iso,
    exposureIndex,
    description: v1.description ?? "",
    loaded: v1.loaded ?? "",
    unloaded: unloaded || "",
    developed: v1.developed ?? "",
    camera: v1.camera,
    lens,
    location: v1.location ?? "",
    developedAt: v1.developedAt ?? "Lab",
    notes: v1.notes ?? "-",
  };

  if (v1.developedAt === "Home" && v1.process) {
    const devStep = v1.process.steps?.find(
      (s) => s.name?.toLowerCase() === "developer",
    );
    const devTemp = await promptNumber(fmsg("Developer temperature (°C)"), 38);
    meta.process = {
      developer: {
        name: v1.process.chemicals?.developer?.name ?? "",
        dilution: v1.process.chemicals?.developer?.dilution ?? "",
        time: devStep?.time ?? "",
        t: devTemp,
      },
      processor: v1.process.filmProcessor ?? null,
    };
  }

  return meta;
}

export async function migrateFile(inputPath) {
  const raw = await readFile(inputPath, "utf8");
  const v1 = YAML.parse(raw);
  const meta = await convertV1ToMeta(v1);
  const outPath = join(dirname(inputPath), "meta.yaml");
  await writeFile(outPath, YAML.stringify(meta));
  return outPath;
}
