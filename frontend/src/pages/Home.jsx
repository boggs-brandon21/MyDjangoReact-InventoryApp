import { useState, useEffect, useContext } from 'react';
import api from '../api';
import Item from '../components/Item';
import OrderIn from '../components/OrdersIn';
import CreateItemForm from '../components/Forms/ItemForm';
import CreateOrderInForm from '../components/Forms/OrderInForm';
// incorporate our ConversationsContext here to manage notifications for an order being created
import { ConversationsContext } from '../components/Context/ConversationContext';

// import '../styles/Table.css';

function Home() {
	const [items, setItems] = useState([]);
	const [orders, setOrders] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null); // Track the item that is clicked

	// used to fetchConversations to trigger an unread notification in the navbar when an order is created
	const { fetchConversations } = useContext(ConversationsContext);

	// Synchronize with the API to ensure we have all the items and orders
	useEffect(() => {
		getItems();
		getOrders();
	}, []);

	// accessing our backend routes
	const getItems = () => {
		api.get('/api/items/')
			.then((res) => res.data)
			.then((data) => {
				setItems(data); // Set our items state to update the array
				console.log(data);
			})
			.catch((err) => alert(err));
	};

	// delete item
	const deleteItem = (id) => {
		// have to modify due to API change with routing.. there is no /delete endpoint, just add method
		api.delete(`/api/items/${id}/`)
			.then((res) => {
				if (res.status === 204) {
					// Delete action was successful, 204 No Content
					alert('Item Deleted!');
					getItems(); // <-- now we refetch after we know the item is deleted
				} else {
					alert('Failed to delete item.');
				}
			})
			.catch((error) => alert(error));
	};

	// get the orders from the API
	const getOrders = () => {
		api.get('/api/ordersIn/')
			.then((res) => res.data)
			.then((data) => {
				setOrders(data);
				console.log(data);
			})
			.catch((err) => alert(err));
	};

	// accessing our backend route to obtain a specific item
	const getOrdersForItem = (item) => {
		// need to modify endpoint to use a query param for the item because the /order endpoint doesn't exist
		api.get(`/api/ordersIn/?item=${item}`)
			.then((res) => res.data)
			.then((data) => {
				setOrders(data);
				console.log(data);
			})
			.catch((err) => alert(err));
	};

	// delete an order
	const deleteOrder = (item) => {
		// same as above, need to remove the /delete endpoint because it doesn't exist
		api.delete(`/api/ordersIn/${item}/`)
			.then((res) => {
				if (res.status === 204) {
					alert('Order Deleted!');
					getOrders();
				} else {
					alert('Failed to delete order.');
				}
			})
			.catch((error) => alert(error));
	};

	// Call this to handle the item click
	const handleItemClick = (item) => {
		setSelectedItem(item); // When an item is selected - state change
		getOrdersForItem(item.id); // Obtain the orders for that item's id
	};

	const handleOrderCreated = (item) => {
		if (item) getOrdersForItem(item);
		fetchConversations();
	};

	// Setup filtered orders to call when matching the item to the orders
	const filteredOrders = selectedItem
		? orders.filter((order) => order.item === selectedItem.id)
		: [];

	return (
		<div className="table-responsive">
			{/* TABLE OF ITEMS */}
			<table className="table table-bordered caption-top">
				<caption>Inventory Items</caption>
				<thead className="">
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Quantity</th>
						<th scope="col">Created</th>
						<th scope="col">Updated</th>
						<th scope="col">Description</th>
						<th scope="col">Added By</th>
						<th scope="col" className="">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{items.map((item) => (
						<Item
							key={item.id}
							item={item}
							onDelete={deleteItem}
							onNameClick={() => handleItemClick(item)}
						/>
					))}
				</tbody>
			</table>

			{/* IF an item is selected, show its orders + the form to create more orders */}
			{selectedItem && (
				<div style={{ marginTop: '2rem' }}>
					<h3>Orders for: {selectedItem.name}</h3>
					{filteredOrders.length === 0 ? (
						<p>No orders found for this item.</p>
					) : (
						<table className="table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Ordered By</th>
									<th>Item Name</th>
									<th>Num Ordered</th>
									<th>Ordered On</th>
									<th>Expected Delivery</th>
									<th>Delivered?</th>
									<th>Delivered On</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<OrderIn
										key={order.id}
										order={order}
										onDelete={deleteOrder}
									/>
								))}
							</tbody>
						</table>
					)}

					{/* CREATE ORDER FORM for the selected item */}
					<CreateOrderInForm
						id={selectedItem.id}
						itemName={selectedItem.name}
						onOrderCreated={handleOrderCreated}
					/>
				</div>
			)}
		</div>
	);
}

export default Home;
