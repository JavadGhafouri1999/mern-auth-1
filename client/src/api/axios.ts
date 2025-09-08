import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
	headers: { "Content-Type": "application/json" },
	timeout: 1000,
});

// Request interceptor
api.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem("accessToken");
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// // Add a response interceptor
// axios.interceptors.response.use(
// 	(response) => response,
// 	async () => {}
// );

export default api;
