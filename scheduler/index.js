const fetch = (url) =>
	import("node-fetch").then(({default: fetch}) => fetch(url));

/**
 * Delay for a number of milliseconds
 */
function sleep(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}

const scheduler = async () => {
	let time = new Date().getTime();
	let interval = 2000; // milisec;
	let numPing = 10;
	let curPing = 0;
	while (curPing < numPing) {
		const f = await fetch("https://clickdi.top/api/hello");
		f.json().then((data) => {
			const now = new Date().getTime();
			console.log(data, `${now - time - 2000} milliseconds`);
			time = new Date().getTime();
			curPing++;
		});
		sleep(interval);
	}
};

scheduler();
