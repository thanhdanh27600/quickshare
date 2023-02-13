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

export type ForwardRs = Response & {
	history?: UrlShortenerHistory | null;
};

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ForwardRs>
) {
	try {
		const ip = requestIp.getClientIp(req);
		if (req.method !== "POST") {
			return res
				.status(HttpStatusCode.METHOD_NOT_ALLOWED)
				.json({errorMessage: "Method Not Allowed"});
		}
		const hash = req.body.hash as string;
		console.log("forward hash", hash);
		if (!hash) {
			return res.status(HttpStatusCode.BAD_REQUEST).send({
				errorMessage: "You have submitted wrong data, please try again",
				errorCode: "BAD_REQUEST",
			});
		}
		let lookupIp;
		if (ip) {
			lookupIp = geoIp.lookup(ip);
		}

		if (!lookupIp) {
			console.log(!ip ? "ip not found" : `geoIp cannot determined ${ip}`);
		} else {
			console.log("lookupIp", lookupIp);
		}

		const history = await prisma.urlShortenerHistory.findFirst({
			where: {hash},
		});
		await prisma.$disconnect();
		res.status(HttpStatusCode.OK).json({history});
	} catch (error) {
		console.error(error);
		await prisma.$disconnect();
		res
			.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json({errorMessage: (error as any).message || "Something when wrong."});
	}
}
