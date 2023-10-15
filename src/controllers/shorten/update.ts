import { shortenCacheService } from '../../services/cache/shorten.service';
import prisma from '../../services/db/prisma';
import { ShortenUrl } from '../../types/shorten';
import { api, badRequest, errorHandler, successHandler } from '../../utils/axios';
import { cloudinaryInstance } from '../../utils/cloudinary';
import { decryptS } from '../../utils/crypto';
import { validateUpdateShortenSchema } from '../../utils/validateMiddleware';

export const handler = api<ShortenUrl>(
  async (req, res) => {
    let hash = req.body.hash as string;
    let locale = req.body.locale as string;
    let ogTitle = req.body.ogTitle as string;
    let ogDescription = req.body.ogDescription;
    let ogImgSrc = req.body.ogImgSrc;
    let ogImgPublicId = req.body.ogImgPublicId;
    let theme = req.body.theme;
    let mediaId = req.body.mediaId;
    await validateUpdateShortenSchema.parseAsync({
      hash,
      locale,
      ogTitle,
      ogDescription,
      ogImgSrc,
      ogImgPublicId,
      mediaId,
      theme,
    });

    if (mediaId) {
      const media = await prisma.media.findUnique({ where: { id: mediaId } });
      if (!media) return badRequest(res);
    }

    const history = await prisma.urlShortenerHistory.findUnique({ where: { hash } });
    if (!history) return badRequest(res, "No URL was found on your request. Let's shorten one!");

    if (history.password) {
      const token = req.headers['X-Platform-Auth'.toLowerCase()] as string;
      if (!token || decryptS(token) !== history.id.toString()) {
        return errorHandler(res);
      }
    }

    const rs = await prisma.urlShortenerHistory.update({
      where: { id: history.id },
      data: {
        ...(mediaId ? { Media: { connect: { id: mediaId } } } : null),
        ogTitle,
        ogDescription,
        ogImgSrc,
        ogImgPublicId,
        theme,
      },
    });
    // purge cache
    shortenCacheService.expireShortenHash(hash);
    // remove used tag
    if (ogImgPublicId) {
      cloudinaryInstance.uploader.remove_tag('unused', ogImgPublicId).then().catch();
    }
    return successHandler(res, rs);
  },
  ['PUT'],
);
