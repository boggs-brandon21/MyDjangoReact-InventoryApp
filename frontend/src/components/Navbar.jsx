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
import { AuthContext } from './Context/AuthContext';

function NavbarTop() {
	// No longer need to access the token, can use the AuthContext with the useContext hook to pull currentUser info
	const { currentUser, logout } = useContext(AuthContext);

	// Access our unreadCount from out ConversationsContext
	const { unreadCount } = useContext(ConversationsContext);

	// If there is a username from the token, user is logged in, otherwise no user
	const isLoggedIn = Boolean(currentUser);

	// Instantiate navigate variable to imperatively issue the navigation action
	const navigate = useNavigate();

	// Arrow function that handles the logout event by removing the jwt token
	const handleLogout = () => {
		logout();

		// Reload the page to ensure full state reset
		window.location.reload();

		// Navigate to login screen => useNavigate('/login')
		navigate('/login');
	};

	return (
		<Navbar
			className="mb-4"
			data-bs-theme="dark"
			style={{ height: '4.50rem' }}
		>
			<Container className="container-fluid">
				<Navbar.Brand className="" href="/">
					<img
						src={logo}
						className="object-fit-contain border rounded"
						alt="Furnacare Logo"
					/>
				</Navbar.Brand>

				<Nav className="">
					<Stack direction="horizontal" gap={3}>
						<Link
							className="link-light text-decoration-none fw-bold"
							to="/"
							aria-current="page"
						>
							Furnacare Inventory
						</Link>
						<Link
							className="link-light text-decoration-none fw-bold"
							to="/orders-in"
						>
							Incoming Orders
						</Link>
						<Link className="link-light text-decoration-none fw-bold" to="/create-item">
							Create Item
						</Link>
						<Link className="link-light text-decoration-none fw-bold" to="/orders-out">
								Outgoing Orders
						</Link>
					</Stack>
				</Nav>

				<Nav>
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
								Signed in as:{' '}
								<strong>{currentUser.username}</strong>
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
				</Nav>
			</Container>
		</Navbar>
	);
}

export default NavbarTop;
