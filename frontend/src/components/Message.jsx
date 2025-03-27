import React, { useState, useContext } from 'react';
import { Stack, Form, Button, Container } from 'react-bootstrap';
import { useGetReceiverMsg } from './Hooks/useGetReceiver';
import { AuthContext } from './Context/AuthContext';
import { ConversationsContext } from './Context/ConversationContext';
import moment from 'moment';

// Testing a change with removing props and centralizing Conversation handling in the context provider
// ({ conversation, refreshMessages });

const MessageBox = () => {
	const { currentUser } = useContext(AuthContext);

	// Get the function to create a new message from the ConversationsContext
	const { createMessage, currentConversation, messages, isLoading } =
		useContext(ConversationsContext);

	// Get the target user using custom hook
	const { targetUser } = useGetReceiverMsg(currentConversation, currentUser);

	// Local state to hold the new message text
	const [text, setText] = useState('');

	if (!targetUser)
		return (
			<p style={{ textAlign: 'center', width: '100%' }}>
				No conversation selected yet.
			</p>
		);

	if (isLoading)
		return (
			<p style={{ textAlign: 'center', width: '100%' }}>
				Loading Chat...
			</p>
		);
	// Handler for setting the message
	const handleSend = async (e) => {
		e.preventDefault();

		// If the input is empty do nothing
		if (!text.trim()) return;

		try {
			// Call createMessage passing the conversation id and message data
			await createMessage(currentConversation.id, {
				text,
			});

			// Clear the input field after sending
			setText('');
		} catch (err) {
			console.error('Error sending message:', err);
		}
	};

	// console.log(targetUser);
	// console.log(conversation);

	// Adjust our UI to display an actual message box with react-bootstrap

	return (
		<Stack gap={4} className="chat-box">
			<div className="chat-header">
				<strong>{targetUser?.username}</strong>
			</div>
			<Stack gap={3} className="messages">
				{messages.map((message) => (
					<Stack
						key={message.id}
						className={
							message?.sender.username === currentUser?.username
								? 'message self align-self-end flex-grow-0'
								: 'message align-self-start flex-grow-0'
						}
					>
						<span>{message.text}</span>
						<span className="message-footer">
							{moment(message.sent_at).calendar()}
						</span>
					</Stack>
				))}
			</Stack>
			<Form
				onSubmit={handleSend}
				className="d-flex align-items-center chat-input flex-grow-0"
			>
				<Form.Control
					type="text"
					placeholder="Enter your message here..."
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<Button type="submit" className="send-btn ms-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						className="bi bi-send-fill"
						viewBox="0 0 16 16"
					>
						<path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
					</svg>
				</Button>
			</Form>
		</Stack>
	);
};

export default MessageBox;
