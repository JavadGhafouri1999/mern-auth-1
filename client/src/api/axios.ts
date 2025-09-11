import axios from "axios";

const API = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
	headers: { "Content-Type": "application/json" },
	timeout: 5000,
});

// // Request interceptor
// API.interceptors.request.use(
// 	(config) => {
// 		const accessToken = localStorage.getItem("accessToken");
// 		if (accessToken) {
// 			config.headers.Authorization = `Bearer ${accessToken}`;
// 		}
// 		return config;
// 	},
// 	(error) => Promise.reject(error)
// );

API.interceptors.response.use(
	(response) => response.data,
	(error) => {
		// Check if error.response exists before destructuring
		if (error.response) {
			const { status, data } = error.response;
			return Promise.reject({ status, ...data });
		}
		// Handle network errors or other issues where error.response is undefined
		return Promise.reject({
			status: 0,
			message: "Network Error or Server Unreachable",
		});
	}
);

export default API;
