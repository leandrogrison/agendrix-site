// vercel-build.js
const fs = require('fs-extra');
const path = require('path');
const serverDistPath = './dist/agendrix-site/server';
const browserDistPath = './dist/agendrix-site/browser';

// copia a build SSR para a pasta /api (função serverless)
fs.copySync(serverDistPath, './api');

fs.writeFileSync(
  path.resolve('./api/index.js'),
  `
  const { app } = require('./main');
  module.exports = (req, res) => {
    app(req, res);
  };
`
);
