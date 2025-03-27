import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import CreateItem from './pages/CreateItem';
import ProtectedRoute from './components/ProtectedRoute';
import NavbarTop from './components/Navbar';
import OrdersIn from './pages/Orders';
import Conversations from './pages/Conversations';
import { ConversationsProvider } from './components/Context/ConversationContext';
import { Container } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
// import SidebarMenu from './components/Sidebar';

function Logout() {
	localStorage.clear();
	return <Navigate to="/login" />;
}

function RegisterAndLogout() {
	localStorage.clear();
	return <Register />;
}

function App() {
	return (
		<>
			<ConversationsProvider>
				<NavbarTop />
				<Container>
					<Routes>
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<Home />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/orders-in"
							element={
								<ProtectedRoute>
									<OrdersIn />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/conversations"
							element={
								<ProtectedRoute>
									<Conversations />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/create-item"
							element={
								<ProtectedRoute>
									<CreateItem />
								</ProtectedRoute>
							}
						/>
						<Route path="/login" element={<Login />} />
						<Route path="/logout" element={<Logout />} />
						<Route path="/register" element={<Register />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Container>
			</ConversationsProvider>
		</>
	);
}

export default App;
