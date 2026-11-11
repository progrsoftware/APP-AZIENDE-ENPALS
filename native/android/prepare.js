'use strict';
// Uso: node prepare.js martinelli|autonomi|totem
// Prepara la cartella "www" (la pagina dell'app) e il file capacitor.config.json.
const fs = require('fs');
const path = require('path');

const id = process.argv[2];
if (!id) { console.error('Indica la variante: martinelli oppure autonomi'); process.exit(1); }
const v = JSON.parse(fs.readFileSync(path.join(__dirname, 'variants', id + '.json'), 'utf8'));
const root = path.join(__dirname, '..', '..');
const www = path.join(__dirname, 'www');

fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });

let html = fs.readFileSync(path.join(root, v.web, 'index.html'), 'utf8');
html = html.split('src="../sync-config.js"').join('src="sync-config.js"');
if (v.titolo) html = html.replace(/<title>[^<]*<\/title>/, '<title>' + v.titolo + '</title>');
if (v.cloudApp) { if (html.indexOf("clApp='azienda'") < 0) { console.error('clApp non trovato'); process.exit(1); } html = html.replace("clApp='azienda'", "clApp='" + v.cloudApp + "'"); }
fs.writeFileSync(path.join(www, 'index.html'), html);

const cfgFile = path.join(root, 'sync-config.js');
fs.writeFileSync(path.join(www, 'sync-config.js'),
  fs.existsSync(cfgFile) ? fs.readFileSync(cfgFile) : "window.SYNC_CFG = { url: '', key: '' };\n");

fs.writeFileSync(path.join(__dirname, 'capacitor.config.json'), JSON.stringify({
  appId: v.appId,
  appName: v.productName,
  webDir: 'www',
  server: { androidScheme: 'https' }
}, null, 2));
console.log('Preparato:', v.productName);
