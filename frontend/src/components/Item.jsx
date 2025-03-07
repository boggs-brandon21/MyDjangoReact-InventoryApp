import React from 'react';

function Item({ item, onDelete, onNameClick }) {
	const formattedDate = new Date(item.created).toLocaleDateString('en-US');
	const formattedDateSecond = new Date(item.updated).toLocaleDateString(
		'en-US'
	);

	return (
		<tr className="item-row">
			<td
				className="item-name"
				style={{ cursor: 'pointer', color: 'blue' }}
				onClick={onNameClick}
			>
				{item.name}
			</td>
			<td className="item-quantity">{item.quantity}</td>
			<td className="item-created">{formattedDate}</td>
			<td className="item-updated">{formattedDateSecond}</td>
			<td className="item-description">{item.description}</td>
			<td className="item-addedBy">{item.addedBy}</td>
			<td>
				<button
					className="delete-button"
					onClick={() => onDelete(item.id)}
				>
					Delete
				</button>
			</td>
		</tr>
	);
}

export default Item;
