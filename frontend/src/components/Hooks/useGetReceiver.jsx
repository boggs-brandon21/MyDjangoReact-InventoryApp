import { useEffect, useState } from 'react';
import api from '../../api';

export const useGetReceiverMsg = (conversation, user) => {
	const [targetUser, setTargetUser] = useState(null);
	const [error, setError] = useState(null);

	// If conversation.participants contains objects, extract the id property
	const targetUserId = conversation?.participants.find(
		(participant) => participant.id !== user?.id
	)?.id;

	useEffect(() => {
		const getUser = async () => {
			if (!targetUserId) return;

			try {
				const response = await api.get(`api/users/${targetUserId}`);
				if (response.error) {
					setError(response.error);
				} else {
					setTargetUser(response.data);
					console.log("Target USer", response.data);
				}
			} catch (err) {
				setError(err);
			}
		};
		getUser();
	}, [targetUserId]); // Re-run the effect when the targetUserId changes

	return [targetUser, error];
};
