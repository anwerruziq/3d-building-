import fs from 'fs';
import path from 'path';

const glbPath = path.resolve('public/models/city.glb');
const buffer = fs.readFileSync(glbPath);

// Read GLB header
const magic = buffer.toString('utf8', 0, 4);
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);

console.log(`GLB Header: magic=${magic}, version=${version}, length=${length}`);

if (magic !== 'glTF') {
  console.error('Not a valid GLB file');
  process.exit(1);
}

// Read Chunk 0 (JSON)
const chunkLength = buffer.readUInt32LE(12);
const chunkType = buffer.toString('utf8', 16, 20);

console.log(`Chunk 0: length=${chunkLength}, type=${chunkType}`);

if (chunkType !== 'JSON') {
  console.error('First chunk is not JSON');
  process.exit(1);
}

const jsonString = buffer.toString('utf8', 20, 20 + chunkLength);
const gltf = JSON.parse(jsonString);

console.log(`Parsed glTF with:`);
console.log(`- ${gltf.nodes?.length || 0} nodes`);
console.log(`- ${gltf.meshes?.length || 0} meshes`);
console.log(`- ${gltf.materials?.length || 0} materials`);
console.log(`- ${gltf.accessors?.length || 0} accessors`);

// Let's print meshes
if (gltf.meshes) {
  const meshNames = gltf.meshes.map(m => m.name);
  console.log('\n--- First 100 Meshes ---');
  console.log(meshNames.slice(0, 100));

  console.log('\n--- Street/Road related meshes ---');
  const streetMeshes = gltf.meshes.filter(m => /road|street|path|ground|floor|asphalt|highway/i.test(m.name));
  console.log(streetMeshes.map(m => m.name));
}

// Let's check nodes to see if there is any translation/scale on nodes
if (gltf.nodes) {
  const nodesWithProps = gltf.nodes.filter(n => n.matrix || n.translation || n.rotation || n.scale);
  console.log('\n--- First 10 nodes with transformations ---');
  console.log(nodesWithProps.slice(0, 10));
}
