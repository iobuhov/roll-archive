import {
  mkdir,
  writeFile,
  readFile,
  access,
  constants,
} from "node:fs/promises";
import * as YAML from "yaml";

async function isReadable(file) {
  try {
    await access(file, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

const storeDir = ".roll";

const chemicals = {
  file: `./${storeDir}/chemicals.yaml`,
};

chemicals.get = async () => {
  if (await isReadable(chemicals.file)) {
    try {
      const data = await readFile(chemicals.file, {
        encoding: "utf-8",
      });
      return YAML.parse(data);
    } catch (err) {
      console.error("Unable read chemicals");
      throw err;
    }
  }
  return [];
};

chemicals.set = async (data) => {
  await mkdir(storeDir, { recursive: true });
  await writeFile(chemicals.file, YAML.stringify(data), { flag: "w+" });
};

const programs = {
  file: `./${storeDir}/programs.yaml`,
};

programs.hasFile = async () => {
  return await isReadable(programs.file);
};

programs.get = async () => {
  if (await isReadable(programs.file)) {
    try {
      const data = await readFile(programs.file, {
        encoding: "utf-8",
      });
      return YAML.parse(data);
    } catch (err) {
      console.error("Unable read programs file");
      throw err;
    }
  }
  return [];
};

programs.set = async (data) => {
  await mkdir(storeDir, { recursive: true });
  await writeFile(programs.file, YAML.stringify(data), { flag: "w+" });
};

export { chemicals, programs };
