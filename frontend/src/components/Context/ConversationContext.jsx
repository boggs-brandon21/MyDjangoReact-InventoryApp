import React from 'react';
import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../../api';

export const ConversationsContext = createContext();

// Only need to pass children as a prop because we handle the user only views on backend
export const ConversationsProvider = ({ children, user }) => {
	const [conversations, setConversations] = useState([]);
	const [potentialTargets, setPotentialTargets] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Function to fetch conversations where the current user is a participant
	const fetchConversations = useCallback(async () => {
		setIsLoading(true); // Set loading state to true before making the api call

		try {
			const response = await api.get('api/conversations/');
			// Update the state with the convos from the response
			setConversations(response.data);
			setError(null);
		} catch (err) {
			console.error('Error fetching conversations: ', err);
			// Update the error state if fetching fails
			setError(err);
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	// Fetch the conversations when the component mounts or when the user changes
	useEffect(() => {
		fetchConversations();
	}, [fetchConversations]);

	// Function to fetch all users and filter out current user or users who are already participants
	const fetchUsers = useCallback(async () => {
		try {
			const response = await api.get('api/users/');
			// Filter users to include those who are not in convo with current user
			const availableUsers = response.data.filter((u) => {
				// Skip the current user
				if (user?.username === u.username) return false;

				// check if the user is already a participant in any convo
				const alreadyInConvo = conversations.some((conversation) =>
					conversation.participants.includes(u.id)
				);

				// Include user only if they are not part of convo
				return !alreadyInConvo;
			});
			setPotentialTargets(availableUsers);
		} catch (err) {
			console.error('Error fetching users: ', err);
			setError(err);
		}
	}, [user, conversations]);

	// Run fetchUsers when the conversation list or current user changes
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	// Function to create a new convo with one or more participants
	// Accepts an array of participant IDs
	const createConversation = useCallback(async (participantIds) => {
		try {
			// prepare payload to send to api
			const payload = { participant_ids: participantIds };

			// Make api call to create the new convo
			const response = await api.post('api/conversations/', payload);
			if (response.error) {
				console.error('Error creating conversation');
				return;
			}
			// Append only the created conversation to the existing convo state
			setConversations((prev) => [...prev, response.data]);
		} catch (err) {
			console.error('Error creating conversation: ', err);
			setError(err);
		}
	}, []);

	// Function to create a new message within a conversation
	// conversationId: ID of the convo where the message should be added
	// messageData: Object containing the message details (sender, receiver, text)
	const createMessage = useCallback(async (conversationId, messageData) => {
		try {
			// Merge conversation ID with the message data to construct the payload
			const payload = { conversation: conversationId, ...messageData };
			// Make API call to create the new message
			const response = await api.post('/api/messages/', payload);

			if (response.error) {
				console.error('Error creating message');
				return;
			}

			// Update the specific conversation by appending the new message to its messages array
			setConversations((prevConvos) =>
				prevConvos.map((convo) => {
					if (convo.id === conversationId) {
						return {
							...convo,
							messages: [
								...(convo.messages || []),
								response.data,
							],
						};
					}
					return convo;
				})
			);
		} catch (err) {
			console.error('Error creating message: ', err);
		}
	}, []);

	// Function to mark messages as read for a given conversation
	const markMessagesAsRead = async (conversationId) => {
		try {
			await api.patch('api/messages/mark-read/', {
				conversation: conversationId,
			});

			// Update the local state to clear unread_count
			setConversations((prevConvos) =>
				prevConvos.map((convo) => {
					if (convo.id === conversationId) {
						return { ...convo, unread_count: 0 };
					}
					return convo;
				})
			);
		} catch (err) {
			console.error('Error marking messages as read: ', err);
		}
	};

	// Calculate the total unread messages across all conversations
	const unreadCount = conversations.reduce(
		(total, convo) => total + (convo.unread_count || 0),
		0
	);

	return (
		<ConversationsContext.Provider
			value={{
				conversations, // Array of conversations objects
				potentialTargets, // Users available for initiating new conversations
				unreadCount, // Total unread messages count
				isLoading, // Loading state for API calls
				error, // Error state for handling API call failures
				fetchConversations, // Function to re-fetch conversations from the backend
				createConversation, // Function to create a new conversation
				createMessage, // Function to add a new message to a conversation
				markMessagesAsRead, // Function to manage read notifications
			}}
		>
			{children}
		</ConversationsContext.Provider>
	);
};
