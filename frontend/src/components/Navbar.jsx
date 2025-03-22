/* eslint-disable no-unused-vars */
import React from 'react';
import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { jwtDecode } from 'jwt-decode';
import '../styles/Navbar.css';
import logo from '../assets/furnacare-logo.jpg';
import { Container, Navbar, Nav, Stack, Button } from 'react-bootstrap';
import { ConversationsContext } from './Context/ConversationContext';

function NavbarTop() {
	// Attempt to read the token from local storage
	const token = localStorage.getItem(ACCESS_TOKEN);
	let username = null;

	// IF we obtain the token from localStorage
	if (token) {
		try {
			const decoded = jwtDecode(token);
			// console.log('Decoded Token', decoded.username);
			username = decoded.username || decoded.sub;
		} catch (err) {
			console.error('Failed to decode token', err);
		}
	}

	// Access our unreadCount from out ConversationsContext
	const { unreadCount } = useContext(ConversationsContext);

	// If there is a username from the token, user is logged in, otherwise no user
	const isLoggedIn = Boolean(username);

	// Instantiate navigate variable to imperatively issue the navigation action
	const navigate = useNavigate();

	// Arrow function that handles the logout event by removing the jwt token
	const handleLogout = () => {
		localStorage.removeItem(ACCESS_TOKEN);
		localStorage.removeItem(REFRESH_TOKEN);

		// Navigate to login screen => useNavigate('/login')
		navigate('/login');
	};

	return (
		<nav
			className="navbar navbar-expand-lg border-bottom border-body py-0"
			data-bs-theme="dark"
		>
			<div className="container-fluid">
				<a className="navbar-brand" href="/">
					<img
						src={logo}
						className="object-fit-contain border rounded"
						alt="Furnacare Logo"
					/>
				</a>

				<div className="collapse navbar-collapse">
					<ul className="navbar-nav mx-auto mb-2">
						<li className="nav-item">
							<a
								className="nav-link fw-bold"
								aria-current="page"
								href="/"
							>
								Furnacare Inventory
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link fw-bold" href="/orders-in">
								Incoming Orders
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link fw-bold" href="/create-item">
								Create Item
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link fw-bold" href="/orders-out">
								Outgoing Orders
							</a>
						</li>
					</ul>
				</div>

				<div>
					{isLoggedIn ? (
						<Stack
							className="mx-auto"
							direction="horizontal"
							gap={2}
						>
							<Link
								to="/conversations"
								className="position-relative d-inline-block px-1"
								style={{
									color: 'inherit',
									textDecoration: 'none',
								}}
							>
								<i className="bi bi-chat-left-text-fill fs-4"></i>

								{unreadCount > 0 && (
									<span
										className="position-absolute top-25 start-100 translate-middle badge rounded-pill bg-danger"
										style={{ fontSize: '0.7rem' }}
									>
										{unreadCount}
									</span>
								)}
							</Link>

							<span>
								Signed in as: <strong>{username}</strong>
							</span>
							<Button
								variant="danger"
								style={{ marginLeft: '0.5rem' }}
								onClick={handleLogout}
							>
								Logout
							</Button>
						</Stack>
					) : (
						<NavLink to="/login">Sign In</NavLink>
					)}
					<div></div>
				</div>
			</div>
		</nav>
	);
}

export default NavbarTop;
