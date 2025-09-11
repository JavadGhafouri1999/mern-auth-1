import axios from "axios";
import queryClient from "../lib/queryClient";
import { navEvents } from "../lib/navigation";

const options = {
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
	headers: { "Content-Type": "application/json" },
	timeout: 5000,
};

const API = axios.create(options);

const tokenRefreshClient = axios.create(options);
tokenRefreshClient.interceptors.response.use((response) => response.data);

API.interceptors.response.use(
	(response) => response.data,
	async (error) => {
		// Check if error.response exists before destructuring
		const { config, response } = error;
		const { status, data } = response || {};

		if (response) {
			// Try to refresh access token
			if (status === 401 && data?.errorCode === "InvalidAccessToken") {
				try {
					await tokenRefreshClient.get("/auth/refresh");
					return tokenRefreshClient(config);
				} catch (error) {
					console.log(error);
					queryClient.clear();
					navEvents.emit("authError");
				}
			}
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
