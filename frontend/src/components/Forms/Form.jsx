import { useState } from 'react';
import api from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import '../../styles/Form.css';

function Form({ route, method }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const navigate = useNavigate();

	const name = method === 'login' ? 'Login' : 'Register';

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		setErrorMessage(''); // Clear any previous error

		// either login or register
		try {
			const res = await api.post(route, { username, password });
			if (method === 'login') {
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
				navigate('/');
			} else {
				navigate('/login');
			}
		} catch (error) {
			console.error('Login/Register error:', error);
			// Backend sends structured error
			const detail = error.response?.data?.detail;
			if(detail) {
				setErrorMessage(detail);
			} else {
				setErrorMessage('Invalid Credentials');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="form-wrapper">
			<form onSubmit={handleSubmit} className="form-container">
				<h1>{name}</h1>

				{/* Show an error message if we have one */}
				{errorMessage && (
					<p className="error-message" style={{ color: 'red' }}>
						{errorMessage}
					</p>
				)}

				<input
					className="form-input"
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Username"
					autoComplete="username"
				/>
				<input
					className="form-input"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					autoComplete="current-password"
				/>
				<button
					className="form-button"
					type="submit"
					disabled={loading}
				>
					{loading ? 'Loading...' : name}
				</button>
			</form>

			{/* Link to switch between Login and Register */}
			{method === 'login' ? (
				<p>
					Don’t have an account?{' '}
					<Link to="/register">Register here</Link>
				</p>
			) : (
				<p>
					Already have an account? <Link to="/login">Login here</Link>
				</p>
			)}
		</div>
	);
}

export default Form;
