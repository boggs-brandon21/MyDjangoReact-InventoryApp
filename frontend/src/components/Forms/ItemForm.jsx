import { useState } from 'react';
import api from '../../api';

function CreateItemForm({ onItemCreated }) {
	const [name, setName] = useState('');
	const [quantity, setQuantity] = useState('');
	const [description, setDescription] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		const newItem = {
			name: name,
			quantity: parseInt(quantity, 10),
			description: description,
		};

		api.post('/api/items/', newItem)
			.then((res) => {
				if (res.status === 201) {
					alert('Item created!');
					onItemCreated?.(); // refetch items
				} else alert('Failed to create item.');
			})
			.catch((err) => alert(err));
	};

	return (
		<form onSubmit={handleSubmit}>
			<h3>Create New Item</h3>
			<label>
				Name:
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</label>
			<br />
			<br/>
			<label>
				Quantity:
				<input
					type="number"
					value={quantity}
					onChange={(e) => setQuantity(e.target.value)}
				/>
			</label>
			<br />
			<br/>
			<label>
				Description:
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</label>
			<br />
			<br/>
			<button type="submit">Create Item</button>
		</form>
	);
}

export default CreateItemForm;
