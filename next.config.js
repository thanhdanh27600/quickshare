/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');
const { cronJob } = require('./src/services/crons');
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } = require('next/constants');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
};

module.exports = async (phase, { defaultConfig }) => {
  console.log('Quickshare is starting...');
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_SERVER) {
    cronJob();
  }
  return nextConfig;
};
