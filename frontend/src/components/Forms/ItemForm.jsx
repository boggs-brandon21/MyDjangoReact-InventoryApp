import { useState } from 'react';
import api from '../../api';
// incorporate the useNavigate hook that we way can redirect the user to inventory for a more natural flow
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function CreateItemForm({ onItemCreated }) {
	const [name, setName] = useState('');
	const [quantity, setQuantity] = useState('');
	const [description, setDescription] = useState('');

	// initialize navigate with useNavigate
	const navigate = useNavigate();

	// change this function to an async function
	const handleSubmit = async (e) => {
		e.preventDefault();
		const newItem = {
			name: name,
			quantity: parseInt(quantity, 10),
			description: description,
		};

		try {
			const res = await api.post('api/items/', newItem);
			if (res.status === 201) {
				alert('Item Created!');

				// Clear the form fields
				setName('');
				setQuantity('');
				setDescription('');

				// Trigger any callback to refresh the data
				onItemCreated?.();

				// Navigate the user to the homepage to view the inventory
				navigate('/');
			} else {
				alert('Failed to create the item.');
			}
		} catch (err) {
			alert(err);
		}
	};

	return (
		<Form
			className="col-lg-5 mx-auto mt-5 border border-black rounded"
			onSubmit={handleSubmit}
		>
			<Form.Group className="text-center border-bottom border-black border-2 mb-3">
				<Form.Label className="fs-2 fw-bold">
					Create Item Form
				</Form.Label>
			</Form.Group>
			<Form.Group className="p-2 mb-3" controlId="formCreateItem">
				<Form.Label className="">Name</Form.Label>
				<Form.Control
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Item Name..."
				/>
			</Form.Group>
			<Form.Group className="p-2 mb-3">
				<Form.Label>Quantity</Form.Label>
				<Form.Control
					type="number"
					value={quantity}
					onChange={(e) => setQuantity(e.target.value)}
					placeholder="Enter a valid number quantity..."
				/>
			</Form.Group>
			<Form.Group className="p-2 mb-3">
				<Form.Label>Description</Form.Label>
				<Form.Control
					as="textarea"
					rows={2}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Please enter a valid description of the item, noting important details about the item..."
				/>
			</Form.Group>
			<Form.Group className="p-2 mb-3 text-center">
				<Button
					className="p-2 text-light"
					variant="success"
					size="lg"
					type="submit"
				>
					Create Item
				</Button>
			</Form.Group>
		</Form>
	);
}

export default CreateItemForm;
