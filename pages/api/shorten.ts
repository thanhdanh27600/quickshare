// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {PrismaClient} from "@prisma/client";
import requestIp from "request-ip";
import type {NextApiRequest, NextApiResponse} from "next";
import {createClient, RedisClientOptions} from "redis";
import {Response} from "types/api";
import {
	LIMIT_URL_HOUR,
	LIMIT_URL_NUMBER,
	LIMIT_URL_SECOND,
	NUM_CHARACTER_HASH,
	REDIS_KEY,
} from "types/constants";
import HttpStatusCode from "utils/statusCode";
import {generateRandomString, isValidUrl} from "utils/text";
import prisma from "db/prisma";
import {log} from "utils/clg";

let redisConfig: RedisClientOptions = {password: process.env.REDIS_AUTH};
if (process.env.NODE_ENV === "production") {
	redisConfig = {url: `redis://default:${process.env.REDIS_AUTH}@cache:6379`};
}
const client = createClient(redisConfig);

client.on("error", (err) => console.log("Redis Client Error", err));

export type ShortenUrlRs = Response & {
	url?: string;
	hash?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ShortenUrlRs>
) {
	try {
		const ip = requestIp.getClientIp(req);
		const url = req.query.url as string;
		// TODO use explicit validator lib
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
		// check or reset get link limit
		await client.connect();
		const keyLimit = `${REDIS_KEY.HASH_LIMIT}:${ip}`;
		const ttl = await client.ttl(keyLimit);
		if (ttl < 0) {
			await client.set(keyLimit, 0);
			await client.expire(keyLimit, LIMIT_URL_SECOND);
		}
		const curLimit = (await client.get(keyLimit)) || "";
		if (parseFloat(curLimit) >= LIMIT_URL_NUMBER) {
			res.status(HttpStatusCode.UNAUTHORIZED).send({
				errorMessage: `Exceeded ${LIMIT_URL_NUMBER} shorten links, please comeback after ${LIMIT_URL_HOUR} hours.`,
				errorCode: "UNAUTHORIZED",
			});
		} else {
			// check hash collapse
			let targetHash = generateRandomString(NUM_CHARACTER_HASH);
			let hashShortenedLinkKey = `${REDIS_KEY.HASH_SHORTEN_BY_HASHED_URL}:${targetHash}`;
			let isExist = await client.HEXISTS(hashShortenedLinkKey, "createdAt");
			let timesLimit = 0;
			// regenerate if collapse
			while (isExist) {
				if (timesLimit++ > 10 /** U better buy lucky ticket */) {
					throw new Error("Bad URL, please try again");
				}
				targetHash = generateRandomString(NUM_CHARACTER_HASH);
				hashShortenedLinkKey = `${REDIS_KEY.HASH_SHORTEN_BY_HASHED_URL}:${targetHash}`;
				isExist = await client.HEXISTS(hashShortenedLinkKey, "createdAt");
			}
			// write hash to cache, increment limit
			const dataHashShortenLink = [
				"createdAt",
				new Date().getTime(),
				"count",
				"0",
			];
			await client.hSet(hashShortenedLinkKey, dataHashShortenLink);
			await client.incr(keyLimit);
			const keyHash = `${REDIS_KEY.HASH_HISTORY_BY_ID}:${ip}`;
			// retrive client id and write to db
			let clientRedisId = await client.hGet(keyHash, "dbId");
			if (!clientRedisId) {
				const record = await prisma.urlShortenerRecord.create({
					data: {ip},
				});
				clientRedisId = record.id + "";
			}
			const dataHashClient = [
				"lastUrl",
				url,
				"lastHash",
				targetHash,
				"dbId",
				clientRedisId,
			];
			await client.hSet(keyHash, dataHashClient);
			const history = await prisma.urlShortenerHistory.create({
				data: {
					url,
					hash: targetHash,
					urlShortenerRecordId: +clientRedisId!,
				},
			});
			log(["history", JSON.stringify(history, null, 2)]);
			res.status(HttpStatusCode.OK).json({url, hash: targetHash});
		}
		await client.disconnect();
	} catch (error) {
		console.error(error);
		await client.disconnect();
		res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json({errorMessage: (error as any).message || "Something when wrong."});
	}
}
