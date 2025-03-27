import { useEffect, useState } from 'react';
import api from '../../api';

export const useGetReceiverMsg = (conversation, user) => {
	const [targetUser, setTargetUser] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const getUser = async () => {
			if (conversation?.notification_only) {
				// If the conversation is a notification, explicitly look for the system user.
				const systemParticipant = conversation.participants.find(
					(participant) => participant.username === 'System'
				);
				if (systemParticipant) {
					setTargetUser(systemParticipant);
				} else {
					setTargetUser({ username: 'System' });
				}
				return;
			}

			const targetUserId = conversation?.participants.find(
				(participant) => participant.id !== user?.id
			)?.id;

			if (!targetUserId) return;

			try {
				const response = await api.get(`api/users/${targetUserId}`);
				if (response.error) {
					setError(response.error);
				} else {
					setTargetUser(response.data);
					// console.log('Target User', response.data);
				}
			} catch (err) {
				setError(err);
			}
		};

		getUser();
	}, [conversation, user]);

	return { targetUser };
};
