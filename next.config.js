/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');
const { initRabbitMQ } = require('./rabbitmq/consumer.ts');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
};

module.exports = async (phase, { defaultConfig }) => {
  await initRabbitMQ();
  return nextConfig;
};
