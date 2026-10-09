const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, 'src', 'assets', 'white_mesh.glb');
const buffer = fs.readFileSync(glbPath);

// GLB header is 12 bytes
const magic = buffer.readUInt32LE(0);
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);

if (magic !== 0x46546C67) {
  console.log("Not a valid GLB");
  process.exit(1);
}

// Read JSON chunk
const chunkLength = buffer.readUInt32LE(12);
const chunkType = buffer.readUInt32LE(16);

if (chunkType !== 0x4E4F534A) {
  console.log("First chunk is not JSON");
  process.exit(1);
}

const jsonBuffer = buffer.slice(20, 20 + chunkLength);
const json = JSON.parse(jsonBuffer.toString('utf8'));

console.log("Meshes:", json.meshes?.length || 0);
if (json.meshes) {
  json.meshes.forEach((m, i) => {
    console.log(`Mesh ${i}: ${m.name}`);
    m.primitives.forEach((p, j) => {
      console.log(`  Primitive ${j}: material index ${p.material}`);
    });
  });
}

console.log("Materials:", json.materials?.length || 0);
if (json.materials) {
  json.materials.forEach((m, i) => {
    console.log(`Material ${i}: ${m.name}`);
  });
}
