import {
  mkdir,
  writeFile,
  readFile,
  access,
  constants,
  readdir,
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

const storeDir = "_archive-data";
const processDir = `./${storeDir}/process`;

const $process = {};

$process.list = async () => {
  const files = await readdir(processDir);
  return files
    .filter((file) => file.endsWith(".yaml"))
    .map((file) => file.replace(".yaml", ""));
};

$process.get = async (id) => {
  const file = `${processDir}/${id}.yaml`;

  if (await isReadable(file)) {
    try {
      const data = await readFile(file, {
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

$process.save = async (data) => {
  await mkdir(processDir, { recursive: true });
  await writeFile(`${processDir}/${data.id}.yaml`, YAML.stringify(data), {
    flag: "w+",
  });
};

export { $process };
