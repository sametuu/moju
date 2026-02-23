#!/usr/bin/env node
/**
 * Minimal test to verify CHARACTERS from characters.js has the intro property.
 * Run: node test/characters-intro-test.js
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = path.join(__dirname, '..');
const configPath = path.join(projectRoot, 'js/data/config.js');
const charactersPath = path.join(projectRoot, 'js/data/characters.js');

// Create sandbox to capture globals (var declarations go to sandbox, const does not)
const sandbox = { EVOLUTIONS: undefined };
vm.createContext(sandbox);

// Load config.js first (defines EVOLUTIONS)
const configCode = fs.readFileSync(configPath, 'utf8');
vm.runInContext(configCode, sandbox);

// Load characters.js - use var so CHARACTERS is exposed to sandbox
const charactersCode = fs.readFileSync(charactersPath, 'utf8')
  .replace(/^const CHARACTERS =/, 'var CHARACTERS =');
vm.runInContext(charactersCode, sandbox);

const CHARACTERS = sandbox.CHARACTERS;
if (!CHARACTERS) {
  console.error('FAIL: CHARACTERS not defined');
  process.exit(1);
}

const intro = CHARACTERS.moju_nasi?.intro;
console.log('CHARACTERS.moju_nasi.intro:', intro);

if (typeof intro !== 'string') {
  console.error('FAIL: moju_nasi.intro is not a string, got:', typeof intro);
  process.exit(1);
}

console.log('PASS: CHARACTERS.moju_nasi has intro property:', intro);
