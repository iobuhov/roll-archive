import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

// ── ANSI helpers ──────────────────────────────────────────────────────────────
const CLR = "\r\x1b[K"; // carriage return + erase to end of line
const UP1 = "\x1b[1A"; // cursor up one line
const HIDE = "\x1b[?25l"; // hide cursor
const SHOW = "\x1b[?25h"; // show cursor

function erase(n) {
  stdout.write(CLR);
  for (let i = 1; i < n; i++) stdout.write(UP1 + CLR);
}

// ── Normalize choices → [{ name, value }] ────────────────────────────────────
function norm(choices) {
  return choices.map((c) =>
    typeof c === "string"
      ? { name: c, value: c }
      : { name: c.name ?? String(c.value), value: c.value },
  );
}

// ── Raw-mode event loop ───────────────────────────────────────────────────────
// onKey(ch) → return any non-undefined value to resolve the prompt
function rawPrompt(onKey) {
  return new Promise((resolve, reject) => {
    const wasRaw = stdin.isTTY ? (stdin.isRaw ?? false) : false;
    if (stdin.isTTY) stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    stdout.write(HIDE);

    function cleanup() {
      stdout.write(SHOW);
      stdin.removeListener("data", handler);
      if (stdin.isTTY && !wasRaw) stdin.setRawMode(false);
      stdin.pause();
    }

    function handler(ch) {
      if (ch === "\x03" || ch === "\x04") {
        cleanup();
        const err = new Error("User force closed the prompt");
        err.name = "ExitPromptError";
        reject(err);
        return;
      }
      const result = onKey(ch);
      if (result !== undefined) {
        cleanup();
        resolve(result);
      }
    }

    stdin.on("data", handler);
  });
}

// ── promptInput ───────────────────────────────────────────────────────────────
export async function promptInput(message, defaultValue) {
  const rl = createInterface({ input: stdin, output: stdout });
  const hint = defaultValue != null ? ` (${defaultValue})` : "";
  const raw = await rl.question(`${message}${hint}: `);
  rl.close();
  return raw !== "" ? raw : (defaultValue ?? "");
}

// ── promptNumber ──────────────────────────────────────────────────────────────
export async function promptNumber(message, defaultValue) {
  const hint = defaultValue != null ? ` (${defaultValue})` : "";
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    while (true) {
      const raw = await rl.question(`${message}${hint}: `);
      if (raw === "" && defaultValue != null) return defaultValue;
      const n = Number(raw);
      if (!isNaN(n) && raw.trim() !== "") return n;
    }
  } finally {
    rl.close();
  }
}

// ── promptConfirm ─────────────────────────────────────────────────────────────
export async function promptConfirm(message) {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    while (true) {
      const raw = await rl.question(`${message} (y/n): `);
      const lo = raw.toLowerCase();
      if (lo === "y" || lo === "yes") return true;
      if (lo === "n" || lo === "no") return false;
    }
  } finally {
    rl.close();
  }
}

// ── promptSelect ──────────────────────────────────────────────────────────────
export function promptSelect(message, rawChoices, defaultValue) {
  const choices = norm(rawChoices);
  const startIdx =
    defaultValue !== undefined
      ? Math.max(0, choices.findIndex((c) => c.value === defaultValue))
      : 0;
  let idx = startIdx;
  let lineCount = 0;

  function draw(first = false) {
    const lines = [message];
    for (let i = 0; i < choices.length; i++) {
      lines.push(`${i === idx ? ">" : " "} ${choices[i].name}`);
    }
    if (!first) erase(lineCount);
    lineCount = lines.length;
    stdout.write(lines.join("\n"));
  }

  draw(true);

  return rawPrompt((ch) => {
    if (ch === "\r" || ch === "\n") {
      erase(lineCount);
      stdout.write(`${message}: ${choices[idx].name}\n`);
      return choices[idx].value;
    }
    if (ch === "\x1b[A") {
      idx = (idx - 1 + choices.length) % choices.length;
    } else if (ch === "\x1b[B") {
      idx = (idx + 1) % choices.length;
    } else {
      return; // ignore, no redraw
    }
    draw();
  });
}

// ── promptSearch ──────────────────────────────────────────────────────────────
const MAX_VISIBLE = 10;

export function promptSearch(message, rawChoices) {
  const choices = norm(rawChoices);
  let query = "";
  let filtered = choices;
  let idx = 0;
  let lineCount = 0;

  function applyFilter() {
    const q = query.toLowerCase();
    filtered = q
      ? choices.filter((c) => c.name.toLowerCase().includes(q))
      : choices;
    idx = 0;
  }

  function draw(first = false) {
    const visible = filtered.slice(0, MAX_VISIBLE);
    const lines = [`${message}: ${query}`];
    if (visible.length === 0) {
      lines.push("  (no matches)");
    } else {
      for (let i = 0; i < visible.length; i++) {
        lines.push(`${i === idx ? ">" : " "} ${visible[i].name}`);
      }
      if (filtered.length > MAX_VISIBLE) {
        lines.push(`  … ${filtered.length - MAX_VISIBLE} more`);
      }
    }
    if (!first) erase(lineCount);
    lineCount = lines.length;
    stdout.write(lines.join("\n"));
  }

  draw(true);

  return rawPrompt((ch) => {
    if ((ch === "\r" || ch === "\n") && filtered.length > 0) {
      const selected = filtered[idx];
      erase(lineCount);
      stdout.write(`${message}: ${selected.name}\n`);
      return selected.value;
    }
    if (ch === "\x1b[A") {
      idx = Math.max(0, idx - 1);
    } else if (ch === "\x1b[B") {
      idx = Math.min(Math.min(filtered.length, MAX_VISIBLE) - 1, idx + 1);
    } else if (ch === "\x7f" || ch === "\x08") {
      // backspace
      query = query.slice(0, -1);
      applyFilter();
    } else if (ch >= " " && ch < "\x7f") {
      // printable ASCII
      query += ch;
      applyFilter();
    } else {
      return; // ignore, no redraw
    }
    draw();
  });
}
