import { Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from '../components/Context/AuthContext';

function ProtectedRoute({ children }) {
	// implement the change to incorporate loading from our change made in authcontext
	const { currentUser, loading } = useContext(AuthContext);

	// add additional logic and handling for loading state
	if (loading) {
		// we can render a loading indicator while authorzation state is being determined
		return <div className="loading">Loading...</div>;
	}

	// If no user is logged in redirect to login
	if (!currentUser) {
		return <Navigate to="/login" />;
	}
	return children;
}

export default ProtectedRoute;
