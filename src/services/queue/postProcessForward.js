const { PrismaClient } = require('@prisma/client');

/**
 *  @param {import('../../types/forward').ForwardMeta} payload
 */
const postProcessForward = async (payload) => {
  /** @type {import('../../db/prisma').Prisma} */
  const prisma = new PrismaClient();

  const { hash, ip, userAgent, fromClientSide, countryCode, updatedAt } = payload;
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
      updatedAt,
      countryCode,
      fromClientSide,
    },
    create: {
      ip,
      updatedAt,
      userAgent,
      urlShortenerHistoryId: history.id,
      countryCode,
      fromClientSide,
    },
  });
};

module.exports = { postProcessForward };
