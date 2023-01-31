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

export const urlRegex = new RegExp(
	"^(https?:\\/\\/)?" + // validate protocol
		"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
		"((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
		"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
		"(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
		"(\\#[-a-z\\d_]*)?$",
	"i"
); // validate fragment locator

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
