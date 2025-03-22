import React, { useState, useContext } from 'react';
import { Stack, Form, Button } from 'react-bootstrap';
import { useGetReceiverMsg } from './Hooks/useGetReceiver';
import { AuthContext } from './Context/AuthContext';
import { ConversationsContext } from './Context/ConversationContext';
const MessageBox = ({ conversation, refreshMessages }) => {
	const { currentUser } = useContext(AuthContext);

	// Get the target user using custom hook
	const [targetUser, error] = useGetReceiverMsg(conversation, currentUser);

	// Get the function to create a new message from the ConversationsContext
	const { createMessage } = useContext(ConversationsContext);

	// Local state to hold the new message text
	const [text, setText] = useState('');

	// Handler for setting the message
	const handleSend = async (e) => {
		e.preventDefault();

		// If the input is empty do nothing
		if (!text.trim()) return;

		try {
			// Call createMessage passing the conversation id and message data
			await createMessage(conversation.id, {
				text,
			});

			// Clear the input field after sending
			setText('');

			// Refresh messages if a refresh function is provided
			if (refreshMessages) {
				refreshMessages();
			}
		} catch (err) {
			console.error('Error sending message:', err);
		}
	};

	// console.log(targetUser);
	// console.log(conversation);

	return (
		<div>
			<Stack
				direction="horizontal"
				gap={2}
				className="user-card align-items-center p-2 justify-content-between"
			>
				<div className="d-flex">
					<div className="me-2">Avatar</div>
					<div className="text-content">
						<div className="name">
							{targetUser?.username || 'Unknown User'}
						</div>
						<div className="text">
							Conversation with{' '}
							{targetUser?.username || 'Unknown'}
						</div>
					</div>
				</div>
				<div className="d-flex flex-column align-items-end">
					<div className="date">12/12/24</div>
					<div className="this-user-notifications">2</div>
					<span className="user-online"></span>
				</div>
			</Stack>
			<Form onSubmit={handleSend} className="mt-3">
				<Form.Group controlId="messageText">
					<Form.Control
						type="text"
						placeholder="Type your message..."
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
				</Form.Group>
				<Button type="submit" variant="primary" className="mt-2">
					Send
				</Button>
			</Form>
		</div>
	);
};

export default MessageBox;
