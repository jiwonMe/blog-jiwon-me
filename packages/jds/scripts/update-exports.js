#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript files
function findTsFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = basePath ? path.join(basePath, item) : item;
    
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...findTsFiles(fullPath, relativePath));
    } else if (item.match(/\.(ts|tsx)$/) && !item.match(/\.(d\.ts|test\.(ts|tsx)|stories\.(ts|tsx))$/)) {
      files.push(relativePath);
    }
  }
  
  return files;
}

// Generate exports for package.json
function generateExports(files) {
  const exports = {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  };
  
  files.forEach(file => {
    if (file === 'index.ts' || file === 'index.tsx') return;
    
    const exportPath = file.replace(/\.(ts|tsx)$/, '');
    const exportKey = `./${exportPath}`;
    
    exports[exportKey] = {
      "types": `./dist/${exportPath}.d.ts`,
      "import": `./dist/${exportPath}.js`,
      "require": `./dist/${exportPath}.cjs`
    };
  });
  
  // Add CSS export
  exports["./globals.css"] = "./dist/globals.css";
  
  return exports;
}

// Generate entry points for tsup
function generateEntries(files) {
  const entries = {};
  
  files.forEach(file => {
    const entryKey = file.replace(/\.(ts|tsx)$/, '');
    entries[entryKey] = `src/${file}`;
  });
  
  return entries;
}

// Update package.json
function updatePackageJson(exports) {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  packageJson.exports = exports;
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('✅ Updated package.json exports');
}

// Update tsup.config.ts
function updateTsupConfig(entries) {
  const configPath = path.join(__dirname, '..', 'tsup.config.ts');
  
  const configContent = `import { defineConfig } from "tsup";

export default defineConfig({
  entry: ${JSON.stringify(entries, null, 4)},
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".js",
    };
  },
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
`;
  
  fs.writeFileSync(configPath, configContent);
  console.log('✅ Updated tsup.config.ts');
}

// Main function
function main() {
  try {
    const srcDir = path.join(__dirname, '..', 'src');
    const files = findTsFiles(srcDir);
    
    console.log('📁 Found files:', files);
    
    const exports = generateExports(files);
    const entries = generateEntries(files);
    
    updatePackageJson(exports);
    updateTsupConfig(entries);
    
    console.log('🎉 Successfully updated exports and entries!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main(); 