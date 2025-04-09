#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { format, join } from "node:path";
import {
  cmd,
  rollId,
  year,
  month,
  filmStock,
  iso,
  pullPush,
  description,
  loaded,
  developed,
  camera,
  lens,
  firstFrame,
  lastFrame,
  location,
  developedAt,
} from "../lib/base-prompts.mjs";
import { promptStruct } from "../lib/utils.mjs";
import { presetPrompt } from "../lib/presets.mjs";
import { addChem } from "../lib/chem-prompts.mjs";
import * as YAML from "yaml";

try {
  const c = await cmd();
  if (c === "ch") {
    await addChem();
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
    month,
    filmStock,
    iso,
    pullPush,
    description,
    loaded,
    developed,
    camera,
    lens,
    firstFrame,
    lastFrame,
    location,
    developedAt,
  });

  if (meta.developedAt === "Home") {
    meta.process = await presetPrompt();
  } else {
    meta.process = null;
  }

  const dst = join(
    process.cwd(),
    meta.year,
    meta.month,
    `${meta.rollId}.${meta.camera.join(" ")}.${meta.filmStock}`,
  );
  const dslr = join(dst, "DSLR");
  const pos = join(dst, "positives");

  for (const d of [dst, dslr, pos]) {
    await mkdir(d, { recursive: true });
  }

  const mt = format({ dir: dst, name: "meta.yaml" });

  await writeFile(mt, YAML.stringify(meta));
}
