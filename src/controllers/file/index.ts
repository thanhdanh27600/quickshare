import { NextApiHandler } from 'next';
import requestIp from 'request-ip';
import { redis } from '../../redis';
import { fileCacheService } from '../../services/cache/file.service';
import prisma from '../../services/db/prisma';
import { fileService } from '../../services/file';
import { generateHash } from '../../services/hash';
import { recordService } from '../../services/record';
import { BASE_URL, HASH, REDIS_KEY, getRedisKey } from '../../types/constants';
import { FileRs } from '../../types/file';
import { api, badRequest, successHandler } from '../../utils/axios';
import HttpStatusCode from '../../utils/statusCode';
import { validateFileSchema } from '../../utils/validateMiddleware';

export const handler = api<FileRs>(
  async (req, res) => {
    const ip = requestIp.getClientIp(req)!;
    let hash = (req.query.hash as string) || null;
    let mediaId = (req.body.mediaId as number) || null;

    if (!!hash && req.method === 'GET') return await getFileHandler(req, res);

    await validateFileSchema.parseAsync({ hash, ip, mediaId });

    // check or reset get request limit
    const reachedFeatureLimit = await fileCacheService.limitFeature(ip);
    if (reachedFeatureLimit) {
      return res.status(HttpStatusCode.TOO_MANY_REQUESTS).send({
        errorMessage: 'EXCEEDED_FILE',
        errorCode: 'UNAUTHORIZED',
      });
    }
    fileCacheService.incLimitIp(ip);

    const record = await recordService.getOrCreate(ip);

    // generate hash
    const fileHash = await generateHash('file');

    // create file and shortened url
    const shortHash = await generateHash('shorten');

    const history = await prisma.urlShortenerHistory.create({
      data: {
        url: `${BASE_URL}/f/${fileHash}`,
        hash: shortHash,
        urlShortenerRecordId: record.id,
      },
    });

    // write to note db
    const file = await prisma.file.create({
      data: {
        hash: fileHash,
        urlShortenerRecordId: record.id,
        urlShortenerHistoryId: history.id,
        mediaId: mediaId!,
      },
      include: { Media: true, UrlShortenerHistory: true },
    });
    // write note to cache
    const dataHashFile = ['id', file.id, 'url', file.Media.url, 'name', file.Media.name];
    fileCacheService.postFileHash({ hash: fileHash, data: dataHashFile });

    return successHandler(res, { file });
  },
  ['POST', 'GET'],
);

const getFileHandler: NextApiHandler<FileRs> = async (req, res) => {
  let hash = req.query.hash as string;

  if (!hash || hash.trim().length < HASH.Length) return badRequest(res);

  // get from cache
  const hashKey = getRedisKey(REDIS_KEY.MAP_FILE_BY_HASH, hash);
  const fileCacheId = await redis.hget(hashKey, 'id');
  const fileCacheMediaUrl = await redis.hget(hashKey, 'url');
  const fileCacheMediaName = await redis.hget(hashKey, 'name');
  if (fileCacheId && fileCacheMediaUrl) {
    // cache hit
    return successHandler(res, {
      file: { hash, Media: { url: fileCacheMediaUrl, name: fileCacheMediaName || 'Unknown file' } },
    });
  }
  // cache missed
  const file = await fileService.getFile(hash);
  if (!file) return badRequest(res);

  const dataHashFile = ['id', file.id, 'url', file.Media.url, 'name', file.Media.name];
  // update cache
  fileCacheService.postFileHash({ hash, data: dataHashFile });
  return successHandler(res, { file });
};
