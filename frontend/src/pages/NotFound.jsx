import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function NotFound() {
	return (
		<div>
			<p>This page does not exist!</p>
			<a href="/">
				{' '}
				<span>Return to Home</span>
			</a>
		</div>
	);
}

export default NotFound;
