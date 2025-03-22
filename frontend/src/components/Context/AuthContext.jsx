// TODO: Implement AuthContext to handle user authorization and jwt token decoding to store user data
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../../constants';

// Create a new context for auth information
export const AuthContext = createContext();

// Set up the provider for the context
export const AuthContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// ADD: Functionality to obtain full user details from the api
	const fetchUserProfile = async (userId) => {
		try {
			const response = await api.get(`api/users/${userId}`);
			if (response.data) {
				// Merge the basic info from the JWT with the full profile details
				setCurrentUser(response.data);
			}
		} catch (error) {
			console.error('Error fetching user profile: ', error);
		}
	};

	// Function to refresh the token
	const refreshToken = async () => {
		const refresh = localStorage.getItem(REFRESH_TOKEN);

		try {
			const res = await api.post('api/token/refresh', { refresh });
			if (res.status === 200) {
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				const decoded = jwtDecode(res.data.access);
				setCurrentUser({
					user_id: decoded.user_id,
					username: decoded.username,
				});
				// Optionally, fetch full profile data
				fetchUserProfile(decoded.user_id);
			} else {
				setCurrentUser(null);
			}
		} catch (error) {
			console.error(error);
			setCurrentUser(null);
		}
	};

	// Check the token and set the user
	const auth = async () => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (!token) {
			setCurrentUser(null);
			setLoading(false);
			return;
		}
		const decoded = jwtDecode(token);
		const tokenExpiration = decoded.exp;
		const now = Date.now() / 1000; // Convert milliseconds to seconds

		if (tokenExpiration < now) {
			await refreshToken();
		} else {
			// Set the basic user info from the JWT
			setCurrentUser({
				user_id: decoded.user_id,
				username: decoded.username,
			});
			// Fetch the full profile
			fetchUserProfile(decoded.user_id);
		}
		setLoading(false);
	};

	useEffect(() => {
		auth();
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser, setCurrentUser }}>
			{loading ? <div>Loading...</div> : children}
		</AuthContext.Provider>
	);
};
