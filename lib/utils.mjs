export function includes(a, b) {
  return a.toLowerCase().includes(b.toLowerCase());
}

export function starts(a, b) {
  [a, b] = [a.toLowerCase(), b.toLowerCase()];
  return a.startsWith(b);
}

export async function promptStruct(obj) {
  if (Array.isArray(obj)) {
    const data = [];
    for (const item of obj) {
      data.push(await promptStruct(item));
    }
    return data;
  }

  if (typeof obj === "function") {
    return await obj();
  }

  if (obj === null) {
    return null;
  }

  if (typeof obj === "object") {
    const data = {};
    for (const [key, value] of Object.entries(obj)) {
      data[key] = await promptStruct(value);
    }
    return data;
  }

  return obj;
}
