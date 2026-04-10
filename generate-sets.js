#!/usr/bin/env node
// data/ klasöründeki tüm .json dosyalarını tarar ve data/sets.json manifest dosyasını günceller.
// Çalıştır: node generate-sets.js

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const outFile = path.join(dataDir, 'sets.json');

const files = fs.readdirSync(dataDir)
  .filter(f => f.endsWith('.json') && f !== 'sets.json')
  .map(f => f.replace(/\.json$/, ''))
  .sort((a, b) => a.localeCompare(b));

fs.writeFileSync(outFile, JSON.stringify(files, null, 2), 'utf8');
console.log(`sets.json güncellendi: ${files.length} set`);
