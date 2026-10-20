'use strict';
// Uso: node prepare.js martinelli|autonomi
// Copia l'app dalla cartella del sito (MARTINELLI o AUTONOMI-SPETTACOLO) dentro "www" e prepara icona e nome.
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
// nel sito la configurazione sta nella cartella sopra; dentro l'app sta accanto alla pagina
html = html.split('src="../sync-config.js"').join('src="sync-config.js"');
fs.writeFileSync(path.join(www, 'index.html'), html);

const cfgFile = path.join(root, 'sync-config.js');
fs.copyFileSync(fs.existsSync(cfgFile) ? cfgFile : path.join(__dirname, 'empty-config.js'), path.join(www, 'sync-config.js'));

fs.mkdirSync(path.join(__dirname, 'build'), { recursive: true });
fs.copyFileSync(path.join(root, 'native', 'assets', 'icon-' + v.id + '.png'), path.join(__dirname, 'build', 'icon.png'));
fs.copyFileSync(path.join(root, 'native', 'assets', 'icon-' + v.id + '-512.png'), path.join(__dirname, 'icon.png'));
fs.writeFileSync(path.join(__dirname, 'app-config.json'), JSON.stringify({ id: v.id, productName: v.productName, dir: v.dir }));
console.log('Preparato:', v.productName);
