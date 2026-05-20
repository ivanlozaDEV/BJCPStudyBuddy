const fs = require('fs');
const path = require('path');

const explorePath = path.join(__dirname, '../src/app/explore.tsx');
const styleScreenPath = path.join(__dirname, '../src/app/style/[id].tsx');
const srmPath = path.join(__dirname, '../src/utils/srm.ts');

if (!fs.existsSync(path.join(__dirname, '../src/app/style'))) {
  fs.mkdirSync(path.join(__dirname, '../src/app/style'), { recursive: true });
}

let content = fs.readFileSync(explorePath, 'utf8');

// 1. We know SRM functions are at the top. Let's move them to srm.ts
// They are from `// SRM Color Mapping Helper` to `  return srm <= 12.5 ? '#0A0C10' : '#FFFFFF';\n}`
const srmMatch = content.match(/(\/\/ SRM Color Mapping Helper[\s\S]*?return srm <= 12\.5 \? '#0A0C10' : '#FFFFFF';\n\})/);
if (srmMatch) {
  let srmContent = srmMatch[1].replace(/function/g, 'export function');
  // I already created srm.ts via write_to_file, but just in case:
  // fs.writeFileSync(srmPath, srmContent);
}

