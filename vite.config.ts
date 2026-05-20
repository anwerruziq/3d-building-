// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "fs";
import path from "path";

// Execute parsing logic inside the Vite config initialization
try {
  const glbPath = path.resolve("public/models/procedural_city_3.glb");
  if (fs.existsSync(glbPath)) {
    const buffer = fs.readFileSync(glbPath);
    const magic = buffer.toString("utf8", 0, 4);
    if (magic === "glTF") {
      const chunkLength = buffer.readUInt32LE(12);
      const jsonString = buffer.toString("utf8", 20, 20 + chunkLength);
      const gltf = JSON.parse(jsonString);

      // Compute mesh local bounding boxes from accessors
      const meshBounds = (gltf.meshes || []).map((mesh: any, idx: number) => {
        let min = [Infinity, Infinity, Infinity];
        let max = [-Infinity, -Infinity, -Infinity];
        mesh.primitives.forEach((prim: any) => {
          const posIdx = prim.attributes?.POSITION;
          if (posIdx !== undefined) {
            const acc = gltf.accessors[posIdx];
            if (acc && acc.min && acc.max) {
              for (let i = 0; i < 3; i++) {
                min[i] = Math.min(min[i], acc.min[i]);
                max[i] = Math.max(max[i], acc.max[i]);
              }
            }
          }
        });
        return {
          index: idx,
          name: mesh.name,
          min,
          max,
          valid: min[0] !== Infinity
        };
      }).filter((m: any) => m.valid);

      // Compute global bounding box
      let gMin = [Infinity, Infinity, Infinity];
      let gMax = [-Infinity, -Infinity, -Infinity];
      meshBounds.forEach((m: any) => {
        for (let i = 0; i < 3; i++) {
          gMin[i] = Math.min(gMin[i], m.min[i]);
          gMax[i] = Math.max(gMax[i], m.max[i]);
        }
      });

      const size = [gMax[0] - gMin[0], gMax[1] - gMin[1], gMax[2] - gMin[2]];
      const center = [(gMin[0] + gMax[0]) / 2, (gMin[1] + gMax[1]) / 2, (gMin[2] + gMax[2]) / 2];
      const maxDim = Math.max(size[0], size[2]);
      const target = 400;
      const s = maxDim > 0 ? target / maxDim : 1;
      const minY = gMin[1];
      const off = [-center[0] * s, -minY * s, -center[2] * s];

      // Compute world coordinates for each mesh
      const meshWorldCoords = meshBounds.map((m: any) => {
        const wMin = [m.min[0] * s + off[0], m.min[1] * s + off[1], m.min[2] * s + off[2]];
        const wMax = [m.max[0] * s + off[0], m.max[1] * s + off[1], m.max[2] * s + off[2]];
        const wCenter = [(wMin[0] + wMax[0]) / 2, (wMin[1] + wMax[1]) / 2, (wMin[2] + wMax[2]) / 2];
        const wSize = [wMax[0] - wMin[0], wMax[1] - wMin[1], wMax[2] - wMin[2]];
        return {
          index: m.index,
          name: m.name,
          center: wCenter,
          size: wSize,
          yRange: [wMin[1], wMax[1]]
        };
      });

      // Sort by size (X * Z area) to identify large planes (ground/street) vs buildings
      meshWorldCoords.sort((a: any, b: any) => (b.size[0] * b.size[2]) - (a.size[0] * a.size[2]));

      fs.writeFileSync("street_coords.txt", JSON.stringify({
        global: { scale: s, offset: off, size, center },
        meshes: meshWorldCoords
      }, null, 2));
    }
  }
} catch (e: any) {
  fs.writeFileSync("street_coords_error.txt", e.stack);
}

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});
