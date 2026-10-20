'use strict';
// Su Mac con processore Apple un'app senza alcuna firma non parte. Senza account sviluppatore Apple
// si usa la firma "locale" (ad hoc): non sostituisce la firma Apple ma permette l'avvio dopo il consenso dell'utente.
const { execFileSync } = require('child_process');
const path = require('path');

exports.default = async function (context) {
  if (context.electronPlatformName !== 'darwin') return;
  const app = path.join(context.appOutDir, context.packager.appInfo.productFilename + '.app');
  console.log('Firma ad hoc di', app);
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', app], { stdio: 'inherit' });
};
