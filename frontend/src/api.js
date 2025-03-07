// We want to write an interceptor that intercepts all requests and adds correct headers
// this is done to automate code -- using axios
// checks if we have an access token, if we do it will automatically add it to requests
import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);



export default api
