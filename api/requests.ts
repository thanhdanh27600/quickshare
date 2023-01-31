import {ShortenUrlRedis} from "types/shortenUrl";
import {API} from "./axios";

export const createShortenUrlRequest = async (url: string) => {
	const rs = await API.get(`/api/shorten?url=${url}`);
	const data = await rs.data;
	return data as ShortenUrlRedis;
};
