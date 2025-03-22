import { Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from '../components/Context/AuthContext';

function ProtectedRoute({ children }) {
	const { currentUser } = useContext(AuthContext);

	// If no user is logged in redirect to login
	if (!currentUser) {
		return <Navigate to="/login" />;
	}
	return children;
}

export default ProtectedRoute;
