#!/usr/bin/env node

import { promptInput, promptNumber, promptSelect } from "../lib/prompts.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { format, join } from "node:path";
import {
  cmd,
  rollId,
  year,
  filmStock,
  iso,
  exposureIndex,
  description,
  loaded,
  developed,
  camera,
  lens,
  location,
  developedAt,
  notes,
  filmFormat,
  unloaded,
  framesShot,
} from "../lib/base-prompts.mjs";
import { promptStruct, fmsg } from "../lib/utils.mjs";
import { chemicalName, filmProcess } from "../lib/film-process-prompt.mjs";
import * as YAML from "yaml";

try {
  const c = await cmd();
  if (c === "proc") {
    const data = await filmProcess();
    await writeFile(`${data.id}.yaml`, YAML.stringify(data), { flag: "w+" });
  } else {
    await roll();
  }
} catch (error) {
  if (error instanceof Error && error.name === "ExitPromptError") {
    process.exit(0);
  } else {
    // Rethrow unknown errors
    throw error;
  }
}

async function roll() {
  const meta = await promptStruct({
    rollId,
    year,
    filmStock,
    filmFormat,
    exposures: () => promptNumber(fmsg("Exposures"), 24),
    framesShot,
    iso,
    exposureIndex,
    description,
    loaded,
    unloaded,
    developed,
    camera,
    lens,
    location,
    developedAt,
    notes,
  });

  if (meta.developedAt === "Home") {
    meta.process = {
      developer: await promptStruct({
        name: chemicalName,
        dilution: () => promptInput(fmsg("Dilution")),
        time: () => promptInput(fmsg("Time")),
        t: () => promptNumber(fmsg("Temperature"), 38),
      }),
    };
    meta.process.processor = await promptSelect(fmsg("Processor"), [
      { value: null, name: "None" },
      { value: "AGO Film Processor" },
    ]);
  }

  const dst = join(
    process.cwd(),
    meta.year,
    `${meta.rollId}.${meta.camera.join(" ")}.${meta.filmStock}`,
  );
  const raw = join(dst, `${meta.rollId}_N_Z7`);
  const pos = join(dst, `${meta.rollId}_P_Z7`);

  for (const d of [dst, raw, pos]) {
    await mkdir(d, { recursive: true });
  }

  const mt = format({ dir: dst, name: "meta.yaml" });

  await writeFile(mt, YAML.stringify(meta));
}
