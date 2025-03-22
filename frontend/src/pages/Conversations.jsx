import React from 'react';
import { useState, useContext } from 'react';
import { ConversationsContext } from '../components/Context/ConversationContext';
import api from '../api';
import {
	Container,
	Row,
	Col,
	ListGroup,
	Badge,
	Stack,
	Button,
} from 'react-bootstrap';
import PotentialConvos from '../components/PotentialConvos';
import MessageBox from '../components/Message';

function Conversations() {
	const { conversations, markMessagesAsRead } =
		useContext(ConversationsContext);
	const [messages, setMessages] = useState([]);
	const [selectedConvo, setSelectedConvo] = useState(null);

	// Get the messages for a specific conversation
	const getMessagesForConversation = async (conversation) => {
		try {
			const response = await api.get(
				`api/messages/?conversation=${conversation.id}`
			);
			setMessages(response.data);
		} catch (error) {
			console.error('Error fetching messages: ', error);
		}
	};

	// Handle the click event for a conversation to obtain the messages for the convo
	const handleConversationClick = (conversation) => {
		setSelectedConvo(conversation);
		getMessagesForConversation(conversation);
		markMessagesAsRead(conversation.id);
	};

	return (
		<Container fluid className="mt-3">
			<Row>
				{/* Left column for potential conversations and conversation list */}
				<Col md={3}>
					<h5>Potential Conversations</h5>
					{/* Component to show users you can start a new conversation with */}
					<PotentialConvos />
					<hr />
					<h5>Your Conversations</h5>
					<ListGroup>
						{conversations.map((conversation) => {
							// If there's no subject, fall back to a default naming convention
							const subject =
								conversation.subject ||
								`Conversation ${conversation.id}`;
							return (
								<ListGroup.Item
									key={conversation.id}
									action
									onClick={() =>
										handleConversationClick(conversation)
									}
									active={
										selectedConvo &&
										conversation.id === selectedConvo.id
									}
								>
									{subject}
									{conversation.unread_count > 0 && (
										<Badge bg="secondary" className="ms-2">
											{conversation.unread_count} unread
										</Badge>
									)}
								</ListGroup.Item>
							);
						})}
					</ListGroup>
				</Col>

				{/* Right column for displaying messages of the selected conversation */}
				<Col md={9}>
					{selectedConvo ? (
						<div>
							<h4>
								Messages for{' '}
								{selectedConvo.subject ||
									`Conversation ${selectedConvo.id}`}
							</h4>
							<div className="message-list mb-3">
								{messages.length > 0 ? (
									messages.map((message) => (
										<div
											key={message.id}
											className="mb-2 p-2 border rounded"
										>
											<p className="mb-0">
												{message.text}
											</p>
										</div>
									))
								) : (
									<p>No messages found.</p>
								)}
							</div>
							{/* MessageBox component for sending new messages
                  Optionally, pass the conversation ID and a refresh function */}
							<MessageBox
								conversation={selectedConvo}
								refreshMessages={() =>
									getMessagesForConversation(selectedConvo)
								}
							/>
						</div>
					) : (
						<p>Select a conversation to view messages.</p>
					)}
				</Col>
			</Row>
		</Container>
	);
}

export default Conversations;
