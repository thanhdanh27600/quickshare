import {
	PrismaClient,
	UrlShortenerHistory,
	UrlShortenerRecord,
} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import {Response} from "types/api";
import HttpStatusCode from "utils/statusCode";
import requestIp from "request-ip";
import geoIp from "geoip-country";
import prisma from "db/prisma";
type Stat = Response & {
	record?:
		| (UrlShortenerRecord & {
				history: UrlShortenerHistory[];
		  })
		| null;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Stat>
) {
	try {
		const ip = requestIp.getClientIp(req);
		if (req.method !== "GET") {
			return res
				.status(HttpStatusCode.METHOD_NOT_ALLOWED)
				.json({errorMessage: "Method Not Allowed"});
		}
		if (!ip) {
			return res.status(HttpStatusCode.BAD_REQUEST).send({
				errorMessage: "You have submitted wrong data, please try again",
				errorCode: "BAD_REQUEST",
			});
		}
		console.log("ip", ip);
		console.log("geoIp", geoIp.lookup(ip));
		const record = await prisma.urlShortenerRecord.findFirst({
			where: {ip},
			include: {
				history: {
					include: {
						urlForwardMeta: true,
					},
				},
			},
		});

		res.status(HttpStatusCode.OK).json({record: record});
	} catch (error) {
		console.error(error);
		res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json({errorMessage: (error as any).message || "Something when wrong."});
	}
}
