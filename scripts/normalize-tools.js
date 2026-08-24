const fs = require("fs");
const path = require("path");

const rawFile = path.join(
  __dirname,
  "../data/raw/osint4all.json"
);

const outputFile = path.join(
  __dirname,
  "../data/tools.json"
);

const rawData = JSON.parse(
  fs.readFileSync(rawFile, "utf8")
);

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeUrl(url) {
  if (!url) return "";

  try {
    return new URL(url).href;
  } catch {
    return "";
  }
}

const seenUrls = new Set();

const tools = rawData.links
  .map((item, index) => {

    const url = normalizeUrl(item.url);

    if (!url) return null;

    return {
      id:
        slugify(item.name) ||
        `tool-${index + 1}`,

      name:
        item.name ||
        new URL(url).hostname,

      url,

      description:
        item.description || "",

      category:
        item.category || "other",

      subcategory:
        item.subcategory || "",

      tags:
        Array.isArray(item.tags)
          ? item.tags
          : [],

      source: "OSINT4ALL",

      source_category:
        item.source_category || "",

      status: "unchecked",

      featured: false
    };
  })
  .filter(Boolean)
  .filter((tool) => {

    if (seenUrls.has(tool.url)) {
      return false;
    }

    seenUrls.add(tool.url);

    return true;
  });

fs.writeFileSync(
  outputFile,
  JSON.stringify(tools, null, 2)
);

console.log(
  `✓ ${tools.length} outils générés`
);
