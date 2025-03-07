import React from 'react';

function OrderIn({ order, onDelete }) {
	const formattedDate = new Date(order.orderedOn).toLocaleDateString('en-US');
	const formattedDateSecond = new Date(
		order.expectedDelivery
	).toLocaleDateString('en-US');
	const formattedDateThird = new Date(order.deliveredOn).toLocaleDateString(
		'en-US'
	);

	return (
		<tr className="order-row">
			<td className="order-id">{order.id}</td>
			<td className="order-orderedBy">{order.addedBy}</td>
			<td className="order-item">{order.item_name}</td>
			<td className="order-quantity">{order.numOrdered}</td>
			<td className="ordered-on">{formattedDate}</td>
			<td className="order-expectedDelivery">{formattedDateSecond}</td>
			<td className="order-wasDelivered">
				{order.wasDelivered ? 'Yes' : 'No'}
			</td>
			<td className="order-deliveredOn">{order.wasDelivered ? formattedDateThird : null}</td>

			<td>
				<button
					className="delete-button"
					onClick={() => onDelete(order.id)}
				>
					Delete
				</button>
			</td>
		</tr>
	);
}

export default OrderIn;
