import { Stack } from 'react-bootstrap';
import { useGetReceiverMsg } from './Hooks/useGetReceiver';
import { useContext } from 'react';
import moment from 'moment';

const UserCard = ({ conversation, user }) => {
	const { targetUser } = useGetReceiverMsg(conversation, user);

	// Format the DateTimeString with the moment library
	const formattedDate = moment(conversation.created_at).format('MM/DD/YYYY');
	// const formattedTime = moment(conversation.created_at).format('hh:mm A');

	// console.log(targetUser);

	return (
		<Stack
			direction="horizontal"
			gap={3}
			className="user-card align-items-center p-2 justify-content-between"
			role="button"
		>
			<div className="d-flex">
				<div className="me-2">Avatar</div>
				<div className="text-content">
					<div className="name">{targetUser?.username}</div>
					<div className="text">Text Message</div>
				</div>
			</div>
			<div className="d-flex flex-column align-items-end">
				<div className="date">{formattedDate}</div>
				<div className="this-user-notifications">
					{conversation.unread_count}
				</div>
			</div>
		</Stack>
	);
};

export default UserCard;
