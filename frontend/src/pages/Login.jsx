import LoginRegisterForm from '../components/Forms/LoginRegisterForm';

function Login() {
	return <LoginRegisterForm route="api/token/" method="login" />;
}

export default Login;
