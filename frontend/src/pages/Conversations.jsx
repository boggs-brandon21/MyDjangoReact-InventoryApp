import React from 'react';
import { useContext } from 'react';
import { ConversationsContext } from '../components/Context/ConversationContext';
import { AuthContext } from '../components/Context/AuthContext';
import { Container, Stack } from 'react-bootstrap';
import PotentialConvos from '../components/PotentialConvos';
import MessageBox from '../components/Message';
import UserCard from '../components/UserCard';

function Conversations() {
	// add fetchConversations from ConversationsContext to populate all conversations
	const {
		conversations,
		markMessagesAsRead,
		updateCurrentConversation,
		isLoading,
	} = useContext(ConversationsContext);

	const { currentUser } = useContext(AuthContext);

	// Handle the click event for a conversation to obtain the messages for the convo
	const handleConversationClick = (conversation) => {
		updateCurrentConversation(conversation);
		markMessagesAsRead(conversation.id);
	};

	// Convert our UI for conversations and messages to Card elements and introduce a messaging box with timestamps: NEW
	return (
		<Container>
			<PotentialConvos />
			{isLoading ? (
				<p>Loading conversations...</p>
			) : conversations.length < 1 ? (
				<p>No conversations found.</p>
			) : (
				<Stack
					direction="horizontal"
					gap={4}
					className="align-items-start"
				>
					<Stack className="messages-box flex-grow-0 pe-3" gap={3}>
						{conversations.map((conversation) => {
							const subject =
								conversation.subject ||
								`Conversation ${conversation.id}`;
							return (
								<div
									key={conversation.id}
									onClick={() =>
										handleConversationClick(conversation)
									}
								>
									<UserCard
										conversation={conversation}
										user={currentUser}
									/>
								</div>
							);
						})}
					</Stack>
					<MessageBox />
				</Stack>
			)}
		</Container>
	);
}

export default Conversations;
