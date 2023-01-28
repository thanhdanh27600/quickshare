// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";

import {createClient} from "redis";
import HttpStatusCode from "utils/statusCode";
import {generateRandomString, isValidUrl} from "utils/text";

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

type Data = {
	url?: string;
	hash?: string;
	errorMessage?: string;
};

const LIMIT_URL_SECOND = 24 * 3600;
const LIMIT_URL_NUMBER = 3;
const NUM_CHARACTER_HASH = 5;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const ip = req.socket.remoteAddress;
	const url = req.query.url as string;
	if (!url) {
		return res
			.status(HttpStatusCode.BAD_REQUEST)
			.send({errorMessage: "BAD_REQUEST"});
	}
	if (!isValidUrl(url)) {
		return res
			.status(HttpStatusCode.BAD_REQUEST)
			.send({errorMessage: "INVALID_URL"});
	}
	await client.connect();
	const keyLimit = `limit:${ip}`;
	const ttl = await client.ttl(keyLimit);
	if (ttl < 0) {
		await client.set(keyLimit, 0);
		await client.expire(keyLimit, LIMIT_URL_SECOND);
	}
	const value = (await client.get(keyLimit)) || "";
	const randomHash = generateRandomString(NUM_CHARACTER_HASH);
	if (parseFloat(value) >= LIMIT_URL_NUMBER) {
		res
			.status(HttpStatusCode.UNAUTHORIZED)
			.send({errorMessage: "UNAUTHORIZED"});
	} else {
		await client.incr(keyLimit);
		const keyHash = `hash:${ip}`;
		await client.hSet(keyHash, ["lastUrl", url, "lastHash", randomHash]);
		res.status(HttpStatusCode.OK).json({url, hash: randomHash});
	}
	await client.disconnect();
}
