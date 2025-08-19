#!/usr/bin/env node

import { input, number, select } from "@inquirer/prompts";
import { mkdir, writeFile } from "node:fs/promises";
import { format, join } from "node:path";
import {
  cmd,
  rollId,
  year,
  month,
  filmStock,
  iso,
  exposureIndex,
  description,
  loaded,
  developed,
  camera,
  lens,
  firstFrame,
  lastFrame,
  location,
  developedAt,
  notes,
  filmFormat,
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
    iso,
    exposureIndex,
    description,
    loaded,
    developed,
    camera,
    lens,
    firstFrame,
    lastFrame,
    location,
    developedAt,
    notes,
  });

  if (meta.developedAt === "Home") {
    meta.process = {
      developer: await promptStruct({
        name: chemicalName,
        dilution: () => input({ message: fmsg("Dilution") }),
        time: () => input({ message: fmsg("Time") }),
        t: () => number({ message: fmsg("Temperature"), default: 38 }),
      }),
    };
    meta.process.processor = await select({
      message: fmsg("Processor"),
      choices: [{ value: null, name: "None" }, { value: "AGO Film Processor" }],
    });
  }

  const dst = join(
    process.cwd(),
    meta.year,
    `${meta.rollId}.${meta.camera.join(" ")}.${meta.filmStock}`,
  );
  const raw = join(dst, "negatives");
  const pos = join(dst, "positives");

  for (const d of [dst, raw, pos]) {
    await mkdir(d, { recursive: true });
  }

  const mt = format({ dir: dst, name: "meta.yaml" });

  await writeFile(mt, YAML.stringify(meta));
}
