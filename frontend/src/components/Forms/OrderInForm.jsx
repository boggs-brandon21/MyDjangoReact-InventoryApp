import { useState } from 'react';
import api from '../../api';

function CreateOrderInForm({ id, onOrderCreated }) {
	const [price, setPrice] = useState('');
	const [numOrdered, setNumOrdered] = useState('');
	const [orderedBy, setOrderedBy] = useState('');
	const [itemName, setItemName] = useState('');
	const [invoiceNum, setInvoiceNum] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		const newOrderData = {
			price: parseFloat(price),
			numOrdered: parseInt(numOrdered, 10),
			orderedBy: orderedBy,
			// If we have an itemid (existing item), use item
			item: id ? parseInt(id, 10) : null,
			// If we want to create or match a new item by name
			item_name: itemName,
			invoiceNum: invoiceNum,
		};

		api.post('/api/ordersIn/', newOrderData)
			.then((res) => {
				if (res.status === 201) {
					alert('Order created!');
					onOrderCreated?.(); // refetch orders
				} else alert('Failed to create order.');
			})
			.catch((err) => alert(err));
	};

	return (
		<form onSubmit={handleSubmit}>
			<h3>Create New Order</h3>
			<label>
				Item Name (Optional):
				<input
					type="text"
					value={itemName}
					onChange={(e) => setItemName(e.target.value)}
				/>
			</label>
			<br />
			<label>
				Price:
				<input
					type="number"
					step="0.01"
					value={price}
					onChange={(e) => setPrice(e.target.value)}
				/>
			</label>
			<br />
			<label>
				Number Ordered:
				<input
					type="number"
					value={numOrdered}
					onChange={(e) => setNumOrdered(e.target.value)}
				/>
			</label>
			<br />
			<label>
				Ordered By:
				<input
					type="text"
					value={orderedBy}
					onChange={(e) => setOrderedBy(e.target.value)}
				/>
			</label>
			<br />
			{/* If linking existing item */}
			<label>
				Item ID (Optional):
				<input type="number" value={id} onChange={(e) => null} />
			</label>
			<br />
			<label>
				Invoice Number:
				<input
					type="text"
					value={invoiceNum}
					onChange={(e) => setInvoiceNum(e.target.value)}
				/>
			</label>
			<br />
			<button type="submit">Create Order</button>
		</form>
	);
}

export default CreateOrderInForm;
