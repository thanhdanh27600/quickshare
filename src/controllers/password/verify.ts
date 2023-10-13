import { shortenService } from '../../services/shorten';
import { Stats } from '../../types/stats';
import { api, badRequest, errorHandler, successHandler } from '../../utils/axios';
import { encryptS } from '../../utils/crypto';
import { validateVerifyPasswordSchema } from '../../utils/validateMiddleware';

export const handler = api<Stats>(
  async (req, res) => {
    await validateVerifyPasswordSchema.parseAsync(req.body);
    const hash = req.body.h as string;
    const password = req.body.p as string;
    // get stats with hash
    const history = await shortenService.getShortenHistory(hash);
    if (!history) return badRequest(res);
    const validPassword = await shortenService.verifyPassword(history, password);
    if (!validPassword) return errorHandler(res);
    return successHandler(res, { token: encryptS(history.id.toString()) } as any);
  },
  ['POST'],
);
