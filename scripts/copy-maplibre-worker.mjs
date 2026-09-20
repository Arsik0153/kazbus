import { copyFile, mkdir } from "node:fs/promises";

const destination = new URL("../public/maplibre/", import.meta.url);

await mkdir(destination, { recursive: true });
await Promise.all(
  ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"].map((file) =>
    copyFile(
      new URL(`../node_modules/maplibre-gl/dist/${file}`, import.meta.url),
      new URL(file, destination),
    ),
  ),
);
