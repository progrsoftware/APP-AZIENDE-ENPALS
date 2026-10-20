'use strict';
// Dice alla pagina che gira dentro l'app per computer (vedi window.NATIVE nelle app).
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('NATIVE', 'electron');
