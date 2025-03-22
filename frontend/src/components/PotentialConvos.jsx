import { useContext } from 'react';
import { ConversationsContext } from './Context/ConversationContext';
import { AuthContext } from './Context/AuthContext';

const PotentialConvos = () => {
	const { currentUser } = useContext(AuthContext);
	const { potentialTargets, createConversation } =
		useContext(ConversationsContext);
	console.log('current user: ', currentUser);
	console.log('ptargets', potentialTargets);

	return (
		<div className="all-users">
			{potentialTargets &&
				potentialTargets.map((u) => (
					<div
						className="single-user"
						key={u.id}
						onClick={() => {
							console.log('Clicked user:', u);
							createConversation([currentUser.id, u.id]);
						}}
					>
						{u.username}
						<span className="user-online"></span>
					</div>
				))}
		</div>
	);
};

export default PotentialConvos;
