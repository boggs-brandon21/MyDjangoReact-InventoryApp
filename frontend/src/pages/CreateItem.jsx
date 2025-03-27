import CreateItemForm from '../components/Forms/ItemForm';
// utilize our ConversationsContext to ensure we are triggering a notification update
import { useContext } from 'react';
import { ConversationsContext } from '../components/Context/ConversationContext';

function CreateItem() {
	// use the fetchConversations method from ConversationsContext to trigger the update
	const { fetchConversations } = useContext(ConversationsContext);

	// Callback passed to the form and will be called when an item is created
	const handleItemCreated = () => {
		fetchConversations(); // Refreshes the conversations to update unread notifications
	};
	return <CreateItemForm onItemCreated={handleItemCreated} />;
}

export default CreateItem;
