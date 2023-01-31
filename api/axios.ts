import axios from "axios";

export const API = axios.create();

API.interceptors.response.use(
	(res) => res,
	(err) => {
		throw new Error(err.response.data.errorMessage);
	}
);
