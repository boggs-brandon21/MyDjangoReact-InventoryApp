/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { jwtDecode } from 'jwt-decode';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '../styles/Navbar.css';
import logo from '../assets/furnacare-logo.jpg';

function NavbarTop() {
	// Attempt to read the token from local storage
	const token = localStorage.getItem(ACCESS_TOKEN);
	let username = null;
	if (token) {
		try {
			const decoded = jwtDecode(token);
			// console.log('Decoded Token', decoded.username);
			username = decoded.username || decoded.sub;
		} catch (err) {
			console.error('Failed to decode token', err);
		}
	}

	// If there is a username from the token, user is logged in, otherwise no user
	const isLoggedIn = Boolean(username);
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem(ACCESS_TOKEN);
		localStorage.removeItem(REFRESH_TOKEN);

		// Navigate to login screen
		navigate('/login');
	};

	return (
		<nav className="navbar navbar-expand-lg bg-dark navbar-dark">
			<div className="container-fluid">
				<a className="navbar-brand" href="/">
					<img
						src={logo}
						className="object-fit-contain border rounded"
						alt="Furnacare Logo"
					/>
				</a>

				<div className="collapse navbar-collapse">
					<ul className="navbar-nav mx-auto mb-2 mb-lg-0">
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
							<a
								className="nav-link fw-bold"
								href="/api/ordersIn"
							>
								Incoming Orders
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link fw-bold" href="/create-item">
								Create Item
							</a>
						</li>
						<li className="nav-item">
							<a
								className="nav-link fw-bold"
								href="/api/ordersOut"
							>
								Outgoing Orders
							</a>
						</li>
					</ul>
				</div>

				<div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
					{isLoggedIn ? (
						<div>
							Signed in as <strong>{username}</strong>
							<button
								style={{ marginLeft: '1rem' }}
								onClick={handleLogout}
							>
								Logout
							</button>
						</div>
					) : (
						<NavLink to="/login">Sign In</NavLink>
					)}
				</div>
			</div>
		</nav>
	);
}

export default NavbarTop;
