import fs from 'fs';
import path from 'path';

const COMP_DIR = './src/components';

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('Modal.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Match function component arguments: export default function X(...) or const X = (...)
      const funcMatch = content.match(/function\s+\w+\s*\(([^)]+)\)/) || content.match(/const\s+\w+\s*=\s*\(([^)]+)\)/);
      if (funcMatch) {
        const argsStr = funcMatch[1];
        console.log(`${fullPath}: ${argsStr.trim().replace(/\s+/g, ' ')}`);
      } else {
        console.log(`${fullPath}: NO MATCH`);
      }
    }
  }
}

scanDir(COMP_DIR);
