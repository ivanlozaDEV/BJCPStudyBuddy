const fs = require('fs');
const path = require('path');

const explorePath = path.join(__dirname, '../src/app/explore.tsx');
const styleScreenPath = path.join(__dirname, '../src/app/style/[id].tsx');

let content = fs.readFileSync(explorePath, 'utf8');

// 1. We will extract the logic manually instead of doing string replacements, because it's too complex.
// Wait, no. A better way is: just copy `explore.tsx` to `style/[id].tsx`, and then we strip parts.
fs.writeFileSync(styleScreenPath, content);
console.log('Copied explore.tsx to [id].tsx');
