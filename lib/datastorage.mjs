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

export { chemicals };
