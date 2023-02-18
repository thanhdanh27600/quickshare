export function isMobile() {
	const userAgent = navigator.userAgent;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		userAgent
	);
}

export function isDesktop(): boolean {
	const userAgent = navigator.userAgent;
	return (
		/Macintosh|Windows|Linux/i.test(userAgent) &&
		!/Mobile|Tablet/i.test(userAgent)
	);
}
