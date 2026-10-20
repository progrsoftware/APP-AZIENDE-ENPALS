'use strict';
// Uso: node patch-android.js martinelli|autonomi  (dopo "npx cap add android")
// Aggiunge la stampa (PrintPlugin), registra il plugin e sostituisce le icone.
const fs = require('fs');
const path = require('path');

const id = process.argv[2];
const v = JSON.parse(fs.readFileSync(path.join(__dirname, 'variants', id + '.json'), 'utf8'));
const main = path.join(__dirname, 'android', 'app', 'src', 'main');
const pkgDir = path.join(main, 'java', ...v.appId.split('.'));
fs.mkdirSync(pkgDir, { recursive: true });

const tpl = (n) => fs.readFileSync(path.join(__dirname, 'templates', n), 'utf8').split('__PKG__').join(v.appId);
fs.writeFileSync(path.join(pkgDir, 'MainActivity.java'), tpl('MainActivity.java'));
fs.writeFileSync(path.join(pkgDir, 'PrintPlugin.java'), tpl('PrintPlugin.java'));

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f), d = path.join(dst, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}
copyDir(path.join(__dirname, 'res', v.id), path.join(main, 'res'));
console.log('Android personalizzato:', v.productName);
