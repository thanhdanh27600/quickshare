const fetch = (url) =>
	import("node-fetch").then(({default: fetch}) => fetch(url));

const scheduler = () => {
	const task = fetch("https://clickdi.top/api/hello");
	setInterval(() => {
		task.then((rs) => {
			console.log(rs);
		});
	}, 2000);
};

scheduler();
