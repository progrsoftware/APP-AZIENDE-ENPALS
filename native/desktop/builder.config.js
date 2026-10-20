'use strict';
// Configurazione di electron-builder. La variante si sceglie con la variabile VARIANT (martinelli o autonomi).
const v = require('./variants/' + (process.env.VARIANT || 'martinelli') + '.json');

module.exports = {
  appId: v.appId,
  productName: v.productName,
  artifactName: v.id + '-${os}-${arch}.${ext}',
  directories: { output: 'dist/' + v.id, buildResources: 'build' },
  files: ['main.js', 'preload.js', 'app-config.json', 'icon.png', 'www/**/*'],
  extraMetadata: { name: v.id + '-desktop', main: 'main.js' },
  afterPack: './adhoc-sign.js',
  mac: {
    category: 'public.app-category.business',
    target: [{ target: 'dmg', arch: ['arm64', 'x64'] }],
    identity: null
  },
  dmg: { title: v.productName, sign: false },
  win: {
    target: [{ target: 'nsis', arch: ['x64'] }]
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    shortcutName: v.productName
  }
};
