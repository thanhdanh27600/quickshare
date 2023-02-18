export function generateRandomString(numChars: number): string {
	const possibleChars = "abcdefghijklmnopqrstuvwxyz0123456789";
	let randomString = "";
	for (let i = 0; i < numChars; i++) {
		randomString += possibleChars.charAt(
			Math.floor(Math.random() * possibleChars.length)
		);
	}
	return randomString;
}

/**
 * 
 * ^ - match the start of the string
 * (?:https?:\/\/)? - match an optional "http://" or "https://" at the beginning of the string
 * (?:www\.)? - match an optional "www." in the domain name
 * [a-z0-9\-]+ - match one or more alphanumeric characters or hyphens in the domain name
 * \.[a-z]+ - match a period followed by one or more lowercase letters for the top-level domain (TLD)
 * (?:\.[a-z]+)? - match an optional subdomain (e.g., "www") and TLD (e.g., "co.uk")
 * (?:\/[\w\-\.\/\?#&=]*)? - match an optional path and query string after the domain name
 * (?:\b|$) - match the end of the string or a word boundary

 */
export const urlRegex =
	/^((?:https?:\/\/)?(?:www\.)?[a-z0-9\-]+\.[a-z]+(?:\.[a-z]+)?(?:\/[\w\-\.\/\?#&=]*)?(?:\b|$))$/i;

export const isValidUrl = (urlString: string) => {
	return !!urlRegex.test(urlString);
};

export const copyToClipBoard = (text: string) => {
	const el = document.createElement("textarea");
	el.value = text;
	document.body.appendChild(el);
	el.select();
	document.execCommand("copy");
	document.body.removeChild(el);
};
