import axios from 'axios'

export const authApi = axios.create({
	baseURL: process.env.EXPO_PUBLIC_BASE_URL,
	headers: {
		'Content-Type' : 'application/json',
	},
	// withCredentials: true,   for web development needed
});

console.log("first", process.env.EXPO_PUBLIC_BASE_URL);