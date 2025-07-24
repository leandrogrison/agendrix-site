const fs = require('fs-extra');
const path = require('path');

const serverDist = path.join(__dirname, 'dist/agendrix-site/server');
const browserDist = path.join(__dirname, 'dist/agendrix-site/browser');

// Copia o dist do server para api
fs.ensureDirSync('./api');
fs.copySync(serverDist, './api');

// Cria o index.js que Vercel espera
fs.writeFileSync(
  './api/index.js',
  `
    const { app } = require('./main');
    module.exports = (req, res) => {
      app(req, res);
    };
  `
);

// Copia os arquivos estáticos para o .vercel/output
fs.ensureDirSync('.vercel/output/static');
fs.copySync(browserDist, '.vercel/output/static');

// Cria o config do Vercel
fs.writeJSONSync('.vercel/output/config.json', {
  version: 3,
  routes: [
    { src: '/api/.*', dest: '/api/index.js' },
    { src: '/(.*)', dest: '/index.html' }
  ]
});
