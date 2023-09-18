const { PrismaClient } = require('@prisma/client');

/**
 *  @param {import('../../types/forward').ForwardMeta} payload
 */

const postProcessForward = async (payload) => {
  prisma = new PrismaClient();

  const { hash, ip, userAgent, fromClientSide, lookupIp } = payload;
  let history = await prisma.urlShortenerHistory.findUnique({
    where: {
      hash,
    },
  });

  if (!history) {
    return null;
  }

  await prisma.urlForwardMeta.upsert({
    where: {
      userAgent_ip_urlShortenerHistoryId: {
        ip,
        userAgent,
        urlShortenerHistoryId: history.id,
      },
    },
    update: {
      countryCode: lookupIp?.country,
      fromClientSide,
    },
    create: {
      ip,
      userAgent,
      urlShortenerHistoryId: history.id,
      countryCode: lookupIp?.country,
      fromClientSide,
    },
  });
};

module.exports = { postProcessForward };
