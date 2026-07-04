import fs from 'fs';
import path from 'path';

const COMP_DIR = './src/components';
const DRY_RUN = process.argv.includes('--apply') ? false : true;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already contains stopPropagation on a backdrop click
  if (content.includes('stopPropagation') && content.includes('fixed inset-0')) {
    console.log(`[SKIP] Already processed: ${filePath}`);
    return;
  }

  // Determine close handler name
  let closeProp = 'onClose';
  if (content.includes('onClose')) {
    closeProp = 'onClose';
  } else if (content.includes('close')) {
    closeProp = 'close';
  } else if (content.includes('onCancel')) {
    closeProp = 'onCancel';
  }

  // Regex to match backdrop (div with 'fixed') and the next nested child div (which represents the modal box)
  const regex = /(<div\s+[^>]*className="[^"]*fixed[^"]*"[^>]*>)([\s\S]*?)(<div\s+[^>]*className=")([^"]*)(")/;
  
  const match = content.match(regex);
  if (!match) {
    console.log(`[WARN] Backdrop div not matched in: ${filePath}`);
    return;
  }

  let backdrop = match[1];
  let intermediate = match[2];
  let childPrefix = match[3];
  let childClass = match[4];
  let childSuffix = match[5];

  // If already has onClick, skip or handle carefully
  if (backdrop.includes('onClick=')) {
    console.log(`[SKIP] Backdrop already has onClick: ${filePath}`);
    return;
  }

  // Modify backdrop to add onClick and cursor-pointer class
  let newBackdrop = backdrop.replace('className="', `onClick={${closeProp}} className="`);
  if (!newBackdrop.includes('cursor-pointer')) {
    newBackdrop = newBackdrop.replace('fixed ', 'fixed cursor-pointer ');
  }

  // Modify child to add stopPropagation and cursor-default class
  let newChild = `${childPrefix.replace('className="', `onClick={(e) => e.stopPropagation()} className="`)}${childClass}`;
  if (!newChild.includes('cursor-default')) {
    newChild = newChild.replace('className="', 'className="cursor-default ');
  }
  newChild = newChild + childSuffix;

  const newContent = content.replace(regex, `${newBackdrop}${intermediate}${newChild}`);

  if (DRY_RUN) {
    console.log(`[DRY-RUN] Will modify: ${filePath} (Using handler: ${closeProp})`);
  } else {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`[APPLIED] Modified: ${filePath} (Using handler: ${closeProp})`);
  }
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('Modal.jsx')) {
      processFile(fullPath);
    }
  }
}

console.log(DRY_RUN ? '=== RUNNING DRY RUN ===' : '=== APPLYING CHANGES ===');
scanDir(COMP_DIR);
