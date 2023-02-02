// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {PrismaClient} from "@prisma/client";
import type {NextApiRequest, NextApiResponse} from "next";
import {createClient} from "redis";
import {
	LIMIT_URL_HOUR,
	LIMIT_URL_NUMBER,
	LIMIT_URL_SECOND,
	NUM_CHARACTER_HASH,
} from "types/constants";
import HttpStatusCode from "utils/statusCode";
import {generateRandomString, isValidUrl} from "utils/text";

const client = createClient();

const prisma = new PrismaClient();

client.on("error", (err) => console.log("Redis Client Error", err));

type Data = {
	url?: string;
	hash?: string;
	errorMessage?: string;
	errorCode?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	try {
		const ip = req.socket.remoteAddress;
		const url = req.query.url as string;
		if (!url || !ip) {
			return res.status(HttpStatusCode.BAD_REQUEST).send({
				errorMessage: "You have submitted wrong data, please try again",
				errorCode: "BAD_REQUEST",
			});
		}
		if (!isValidUrl(url)) {
			return res.status(HttpStatusCode.BAD_REQUEST).send({
				errorMessage: "Wrong URL format, please try again",
				errorCode: "INVALID_URL",
			});
		}
		// CHECK CURRENT LIMIT OR RESET LIMIT
		await client.connect();
		const keyLimit = `limit:${ip}`;
		const ttl = await client.ttl(keyLimit);
		if (ttl < 0) {
			await client.set(keyLimit, 0);
			await client.expire(keyLimit, LIMIT_URL_SECOND);
		}
		const curLimit = (await client.get(keyLimit)) || "";
		const targetHash = generateRandomString(NUM_CHARACTER_HASH);
		if (parseFloat(curLimit) >= LIMIT_URL_NUMBER) {
			res.status(HttpStatusCode.UNAUTHORIZED).send({
				errorMessage: `Exceeded ${LIMIT_URL_NUMBER} shorten links, please comeback after ${LIMIT_URL_HOUR} hours.`,
				errorCode: "UNAUTHORIZED",
			});
		} else {
			// INCR LIMIT, UPDATE LAST HISTORY IN REDIS AND NEW HISTORY IN DB
			await client.incr(keyLimit);
			const keyHash = `history:${ip}`;
			let clientRedisId = await client.hGet(keyHash, "dbId");
			if (!clientRedisId) {
				const record = await prisma.urlShortenerRecord.create({
					data: {ip},
				});
				clientRedisId = record.id + "";
			}
			const dataHash = [
				"lastUrl",
				url,
				"lastHash",
				targetHash,
				"dbId",
				clientRedisId,
			];
			await client.hSet(keyHash, dataHash);
			const history = await prisma.urlShortenerHistory.create({
				data: {
					url,
					hash: targetHash,
					urlShortenerRecordId: +clientRedisId!,
				},
			});
			res.status(HttpStatusCode.OK).json({url, hash: targetHash});
		}
		await client.disconnect();
		await prisma.$disconnect();
	} catch (error) {
		console.error(error);
		await client.disconnect();
		await prisma.$disconnect();
	}
}
