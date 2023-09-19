const prisma = require('../../db/prisma');

/**
 *  @param {import('../../types/forward').ForwardMeta} payload
 */
const postProcessForward = async (payload) => {
  /** @type {import('../../db/prisma').Prisma} */

  const { hash, ip, userAgent, fromClientSide, countryCode, updatedAt } = payload;

  if (!hash) return;

  let history = await prisma.urlShortenerHistory.findUnique({
    where: {
      hash,
    },
  });

  if (!history) {
    return;
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
