import { useContext, useState } from 'react';
import { ConversationsContext } from './Context/ConversationContext';
import { AuthContext } from './Context/AuthContext';

const PotentialConvos = () => {
	const { currentUser } = useContext(AuthContext);
	const { potentialTargets, createConversation } =
		useContext(ConversationsContext);

	// Implement fix to address lack of Subject field for conversations on creation from click
	// need to delay the state change caused immediately by clicking a user
	const [subject, setSubject] = useState('');
	const [selectedUser, setSelectedUser] = useState(null);

	// When we click a user, store the selected user to prompt for the subject input
	const handleUserClick = (user) => {
		setSelectedUser(user);
	};

	// This gets called when the subject is submitted
	const handleConversationCreate = () => {
		if (!subject.trim()) {
			alert('Please enter a subject for the conversation.');
			return;
		}

		createConversation([currentUser.id, selectedUser.id], subject);

		// Clear the subject and selected user afer we create the conversation
		setSubject('');
		setSelectedUser(null);
	};

	// console.log('current user: ', currentUser);
	// console.log('ptargets', potentialTargets);

	return (
		<div>
			<div className="all-users">
				{potentialTargets &&
					potentialTargets.map((u) => {
						return (
							<div
								className="single-user"
								key={u.id}
								onClick={() => handleUserClick(u)}
							>
								{u.username}
								<span className="user-online"></span>
							</div>
						);
					})}
			</div>

			{selectedUser && (
				<div className="subject-input mb-2">
					<h3>Start conversation with {selectedUser.username}</h3>
					<input
						type="text"
						placeholder="Enter Subject..."
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
					/>
					<button className="mt-3" onClick={handleConversationCreate}>
						Start Conversation
					</button>
				</div>
			)}
		</div>
	);
};

export default PotentialConvos;
