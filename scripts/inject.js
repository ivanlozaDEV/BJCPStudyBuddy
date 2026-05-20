const fs = require('fs');
const path = require('path');

const oldExplorePath = path.join(__dirname, '../scripts/temp_explore.tsx');
const styleScreenPath = path.join(__dirname, '../src/app/style/[id].tsx');

const oldLines = fs.readFileSync(oldExplorePath, 'utf8').split('\n');
const handlersLines = oldLines.slice(90, 409); // Lines 91 to 409
const handlers = handlersLines.join('\n');

let idTsx = fs.readFileSync(styleScreenPath, 'utf8');

// Replace everything from `const handleStyleLinkPress =` up to the `if (!selectedStyle) {` with our handlers.
const startIdx = idTsx.indexOf('  const handleStyleLinkPress =');
const endIdx = idTsx.indexOf('  if (!selectedStyle) {');

if (startIdx !== -1 && endIdx !== -1) {
  const newIdTsx = idTsx.substring(0, startIdx) + handlers + '\n\n' + idTsx.substring(endIdx);
  fs.writeFileSync(styleScreenPath, newIdTsx);
  console.log('Injected successfully');
} else {
  console.log('Failed to find injection points');
}
