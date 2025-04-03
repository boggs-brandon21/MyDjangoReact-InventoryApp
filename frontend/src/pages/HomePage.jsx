import React, { useState, useEffect } from 'react';
import api from '../api';

function HomePage() {
	const [orders, setOrders] = useState([]);
	const [items, setItems] = useState([]);
	const [ordersInTransit, setOrdersInTransit] = useState([]);
	const [totalItems, setTotalItems] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch our items within our useEffect with an async function
	useEffect(() => {
		const fetchItems = async () => {
			setIsLoading(true);

			try {
				const response = await api.get('api/items/');
				setItems(response.data);
				setError(null);
			} catch (err) {
				console.error('Error fetching items', err);
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};
		fetchItems();
	}, []);

	// Fetch our orders within our useEffect with an async function
	useEffect(() => {
		const fetchOrders = async () => {
			setIsLoading(true);

			try {
				const response = await api.get('api/ordersIn/');
				setOrders(response.data);
				setError(null);
			} catch (err) {
				console.error('Error fetching orders', err);
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};
		fetchOrders();
	}, []);

	const fetchOrdersInTransit = async () => {
		setIsLoading(true);

		try {
			const response = await api.get('api/ordersIn/?wasDelivered=False');
			setOrdersInTransit(response.data);
			setError(null);
		} catch (err) {
			console.error('Error fetching orders in transit', err);
			setError(err);
		} finally {
			setIsLoading(false);
		}
	};
}
