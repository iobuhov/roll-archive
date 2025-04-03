#!/usr/bin/env node

import { join, format, parse } from 'node:path';
import {
  mkdir,
  writeFile,
  readFile,
  access,
  constants,
} from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { input, search, editor, confirm } from '@inquirer/prompts';
import * as YAML from 'yaml';
import { filmStocks, cameras, lenses } from './data.mjs';

// process.on('uncaughtException', (error) => {
//   if (error instanceof Error && error.name === 'ExitPromptError') {
//     console.log('👋 until next time!');
//   } else {
//     // Rethrow unknown errors
//     throw error;
//   }
// });

const chemicalsDataFile = './radata/chemicals.yaml';

async function checkChemicals() {
  try {
    await access(chemicalsDataFile, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function getChemicals() {
  const hasChemicals = await checkChemicals();
  if (hasChemicals) {
    try {
      const data = await readFile(chemicalsDataFile, { encoding: 'utf-8' });
      return YAML.parse(data);
    } catch (err) {
      console.error('Unable read chemicals');
      throw err;
    }
  }
  return null;
}

let chemicals = await getChemicals();
console.log(chemicals);
try {
  const answer = await input({ message: 'What to add?' });
} catch {
  console.log('fun');
}
// chemicals = chemicals === null ? [] : chemicals;
// chemicals.push(answer);
// const out = YAML.stringify(chemicals);
console.log('out', answer);

await input({ message: 'Y' });
// try {
//   await mkdir('radata');
//   await writeFile(chemicalsDataFile, out, { flag: 'w+' });
// } catch {
//   console.error('1');
// }
// const filmMakers = Object.keys(filmStocks);

// const lensArr = lenses.map((x) => ({ name: x.join(' '), value: x }));

// const camerasArr = cameras.map((x) => ({
//   name: x.join(' '),
//   value: x,
// }));

// const version = 'v0.2.0';

// const options = {
//   version: {
//     type: 'boolean',
//     short: 'v',
//   },
// };

// const args = parseArgs({ options, args: process.argv.slice(2) });

// if (args.values.version) {
//   console.info(version);
//   process.exit(0);
// }

// const year = await input({
//   message: 'Enter year please',
//   default: new Date().getFullYear(),
// });
// const month = await input({
//   message: 'Enter month please (01, 02, ...)',
//   default: `${new Date().getMonth() + 1}`.padStart(2, '0'),
// });
// const rollId = await input({ message: 'Roll id please' });
// const filmMaker = await search({
//   message: 'Film maker pleae',
//   source: (input) => {
//     return filmMakers.filter((x) => starts(x, input ?? ''));
//   },
// });
// const filmStock = await search({
//   message: 'Film stock please',
//   source: (input) => {
//     const items = filmStocks[filmMaker];

//     return items.filter((x) => starts(x, input ?? ''));
//   },
// });

// const pushPull = await input({ message: 'push/pull?', default: '+0' });
// const description = await input({ message: 'Description please' });
// const loaded = await input({ message: 'Loaded date please (yyyy-mm-dd)' });
// const developed = await input({
//   message: 'Developed date please (yyyy-mm-dd)',
// });
// const camera = await search({
//   message: 'Camera please',
//   source: (input) => {
//     return camerasArr.filter((x) => starts(x.name, input ?? ''));
//   },
// });

// const lens = await search({
//   message: 'Lens please',
//   source: (input) => {
//     return lensArr.filter((x) => starts(x.name, input ?? ''));
//   },
// });

// let groupInput = true;
// const groups = [];
// while (groupInput) {
//   const start = await input({
//     message: 'Range start (00, 0, 1, ...)',
//     default: '0',
//   });
//   const end = await input({ message: 'Range end', default: '37' });
//   const date = await input({ message: 'Group date please', default: '-' });
//   const location = await input({ message: 'Group location' });
//   groups.push({ range: `${start}-${end}`, date, location });
//   groupInput = await confirm({
//     message: 'Add one more group?',
//     default: false,
//   });
// }

// const meta = {
//   'roll id': rollId,
//   year,
//   month,
//   'film stock': `${filmMaker} ${filmStock}`,
//   'push/pull': pushPull,
//   description,
//   loaded,
//   developed,
//   camera,
//   lens,
//   groups,
// };
// const dst = join(
//   process.cwd(),
//   year,
//   month,
//   `${rollId}.${camera.join(' ')}.${filmStock}`
// );
// const epson = join(dst, 'Epson Perfection 4490');
// const dslr = join(dst, 'DSLR');
// const pos = join(dst, 'positives');

// for (const d of [dst, epson, dslr, pos]) {
//   await mkdir(d, { recursive: true });
// }

// const mt = format({ dir: dst, name: 'meta.yaml' });

// await writeFile(mt, stringify(meta));

// function includes(a, b) {
//   return a.toLowerCase().includes(b.toLowerCase());
// }

// function starts(a, b) {
//   [a, b] = [a.toLowerCase(), b.toLowerCase()];
//   return a.startsWith(b);
// }
