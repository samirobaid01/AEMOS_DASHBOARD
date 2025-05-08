#!/usr/bin/env node

/**
 * Script to automatically generate barrel (index.ts) files for component directories
 * 
 * Usage: node scripts/generate-barrel.js [directory]
 * Example: node scripts/generate-barrel.js src/components/devices
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get target directory from command line args or use default
const targetDir = process.argv[2] || 'src/components';

// Function to generate a barrel file for a component directory
function generateBarrelFile(directory) {
  console.log(`Generating barrel file for ${directory}...`);
  
  // Read all files in the directory
  const files = fs.readdirSync(directory);
  
  // Filter for TypeScript/React component files
  const componentFiles = files.filter(file => {
    const ext = path.extname(file);
    return (ext === '.tsx' || ext === '.ts') && 
           !file.includes('test') && 
           !file.includes('spec') &&
           file !== 'index.ts';
  });
  
  // Extract component names (without extensions)
  const componentNames = componentFiles.map(file => {
    return path.basename(file, path.extname(file));
  });
  
  if (componentNames.length === 0) {
    console.log(`No components found in ${directory}`);
    return;
  }
  
  // Generate imports and exports
  const imports = componentNames.map(name => `import ${name} from './${name}';`).join('\n');
  const namedExports = `export {\n  ${componentNames.join(',\n  ')}\n};`;
  const defaultExport = `export default {\n  ${componentNames.join(',\n  ')}\n};`;
  
  // Create the barrel file content
  const content = `${imports}\n\n${namedExports}\n\n// This helps with code-splitting and bundling\n${defaultExport}`;
  
  // Write to index.ts in the directory
  fs.writeFileSync(path.join(directory, 'index.ts'), content);
  console.log(`Created barrel file in ${directory}/index.ts with ${componentNames.length} components`);
}

// Check if directory exists
if (!fs.existsSync(targetDir)) {
  console.error(`Directory not found: ${targetDir}`);
  process.exit(1);
}

// Get directory stats
const stats = fs.statSync(targetDir);

if (stats.isDirectory()) {
  // Process the directory
  generateBarrelFile(targetDir);
  
  // Check for subdirectories
  const items = fs.readdirSync(targetDir);
  
  items.forEach(item => {
    const itemPath = path.join(targetDir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      // Skip node_modules and other special directories
      if (item !== 'node_modules' && !item.startsWith('.')) {
        generateBarrelFile(itemPath);
      }
    }
  });
} else {
  console.error(`${targetDir} is not a directory`);
  process.exit(1);
}

console.log('Done!'); 