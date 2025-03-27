import { useState, useContext } from 'react';
import api from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
// import '../../styles/Form.css';
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
// need to use AuthContext to keep user data consistent
import { AuthContext } from '../Context/AuthContext';

function LoginRegisterForm({ route, method }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	// Adding the email, first_name, last_name fields to the registration form to set the default django user fields optionally
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

	// import the updateUser from authcontext
	const { updateUser } = useContext(AuthContext);

	const navigate = useNavigate();

	const name = method === 'login' ? 'Login' : 'Register';

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		setErrorMessage(''); // Clear any previous error

		// either login or register
		try {
			const res = await api.post(route, {
				username,
				password,
				email,
				first_name: firstName,
				last_name: lastName,
			});
			if (method === 'login') {
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

				// now use the updateUser from AuthContext
				updateUser();
				navigate('/');
			} else {
				navigate('/login');
			}
		} catch (error) {
			console.error('Login/Register error:', error);
			// Backend sends structured error
			const detail = error.response?.data?.detail;
			if (detail) {
				setErrorMessage(detail);
			} else {
				// enhance error message to fix
				const errors = error.response?.data;
				const errorString = errors
					? Object.entries(errors)
							.map(([key, value]) => `${key}: ${value}`)
							.join(', ')
					: 'Invalid Credentials';
				setErrorMessage(errorString);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Row style={{ height: '100vh', justifyContent: 'center' }}>
				<Col lg={8}>
					<Stack gap={3}>
						<h2>{name}</h2>
						{method === 'register' && (
							<>
								<Form.Group controlId="firstName">
									<Form.Label>First Name:</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter Your First Name..."
										value={firstName}
										onChange={(e) =>
											setFirstName(e.target.value)
										}
									/>
								</Form.Group>
								<Form.Group controlId="lastName">
									<Form.Label>Last Name:</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter Your Last Name..."
										value={lastName}
										onChange={(e) =>
											setLastName(e.target.value)
										}
									/>
								</Form.Group>
								<Form.Group controlId="email">
									<Form.Label>Email Address:</Form.Label>
									<Form.Control
										type="email"
										placeholder="Enter Your Email Address..."
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
									/>
								</Form.Group>
							</>
						)}
						<Form.Group controlId="username">
							<Form.Label>Username:</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter Your Username..."
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="password">
							<Form.Label>Password:</Form.Label>
							<Form.Control
								type="password"
								placeholder="Enter Your Password..."
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							{method === 'register' && (
								<>
									<Form.Text>
										Your password can’t be too similar to
										your other personal information, must
										contain at least 8 characters, cannot be
										a common password, and cannot be
										entirely numeric.
									</Form.Text>
								</>
							)}
						</Form.Group>
						<Button
							variant="primary"
							type="submit"
							disabled={loading}
						>
							{loading ? 'Loading...' : name}
						</Button>
						{errorMessage && (
							<Alert variant="danger">{errorMessage}</Alert>
						)}
						<br />
						{method === 'login' ? (
							<p>
								Don’t have an account?{' '}
								<Link to="/register">Register here</Link>
							</p>
						) : (
							<p>
								Already have an account?{' '}
								<Link to="/login">Login here</Link>
							</p>
						)}
					</Stack>
				</Col>
			</Row>
		</Form>
	);
}

export default LoginRegisterForm;
