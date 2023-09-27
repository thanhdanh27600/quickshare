const { isEmpty } = require('ramda');
const prisma = require('../../db/prisma');
const { redis } = require('../../redis');

/**
 *  @param {import('../../types/forward').ForwardMeta} payload
 */
const postProcessForward = async (payload) => {
  /** @type {import('../../db/prisma').Prisma} */

  const { hash, ip, userAgent, fromClientSide, countryCode, updatedAt } = payload;

  if (!hash) return;

  const hashKey = `hShort:${hash}`;
  let history = await redis.hgetall(hashKey);

  if (isEmpty(history)) {
    // cache miss
    history = await prisma.urlShortenerHistory.findUnique({
      where: {
        hash,
      },
    });
  }

  if (!history) {
    return;
  }

  const historyId = Number(history.id);

  await prisma.urlForwardMeta.upsert({
    where: {
      userAgent_ip_urlShortenerHistoryId: {
        ip,
        userAgent,
        urlShortenerHistoryId: historyId,
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
      urlShortenerHistoryId: historyId,
      countryCode,
      fromClientSide,
    },
  });
};

module.exports = { postProcessForward };
