'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import Footer from '@/components/seller/Footer';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Trash2, Eye } from 'lucide-react';
import OrderDetailsModal from '@/components/seller/OrderDetailsModal';

const Orders = () => {
	const { currency, getToken, user } = useAppContext();

	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [sortBy, setSortBy] = useState('newest');
	const [selectedOrder, setSelectedOrder] = useState(null);

	const fetchSellerOrders = useCallback(async () => {
		setLoading(true);
		try {
			const token = await getToken();
			const { data } = await axios.get(
				`/api/order/seller-orders?sortBy=${sortBy}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			if (data.success) {
				setOrders(data.orders);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message || 'Failed to fetch orders');
		} finally {
			setLoading(false);
		}
	}, [getToken, sortBy]);

	useEffect(() => {
		if (user) {
			fetchSellerOrders();
		}
	}, [user, fetchSellerOrders]);

	const handleUpdateState = async (orderId, state) => {
		try {
			const token = await getToken();
			const { data } = await axios.put(
				'/api/order/update',
				{ orderId, state },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (data.success) {
				toast.success('Order state updated!');
				fetchSellerOrders(); // Refresh orders
				setSelectedOrder(prev => ({ ...prev, state }));
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message || 'Failed to update order state');
		}
	};

	const handleDeleteOrder = async orderId => {
		if (window.confirm('Are you sure you want to delete this order?')) {
			try {
				const token = await getToken();
				const { data } = await axios.delete('/api/order/delete', {
					headers: { Authorization: `Bearer ${token}` },
					data: { orderId },
				});
				if (data.success) {
					toast.success('Order deleted!');
					fetchSellerOrders(); // Refresh orders
				} else {
					toast.error(data.message);
				}
			} catch (error) {
				toast.error(error.message || 'Failed to delete order');
			}
		}
	};

	const getStateBgColor = state => {
		switch (state) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'processing':
				return 'bg-blue-100 text-blue-800';
			case 'shipped':
				return 'bg-indigo-100 text-indigo-800';
			case 'delivered':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className='flex-1 min-h-screen bg-gray-50'>
			<main className='p-4 sm:p-6 md:p-8'>
				<div className='max-w-7xl mx-auto'>
					<div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
						<h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
							Gérer les commandes
						</h1>
						<div className='flex items-center gap-4'>
							<label htmlFor='sort-orders' className='text-sm font-medium'>
								Trier par:
							</label>
							<select
								id='sort-orders'
								value={sortBy}
								onChange={e => setSortBy(e.target.value)}
								className='p-2 border rounded-md text-sm'
							>
								<option value='newest'>Les plus récentes</option>
								<option value='oldest'>Les plus anciennes</option>
								<option value='recentlyUpdated'>Récemment mis à jour</option>
							</select>
						</div>
					</div>

					{loading ? (
						<Loading />
					) : (
						<div className='bg-white shadow-md rounded-lg overflow-hidden'>
							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead className='bg-gray-50'>
										<tr>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												ID de commande
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Client
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Montant
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Date
											</th>
											<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
												État
											</th>
											<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												Actions
											</th>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{orders.map(order => (
											<tr key={order._id}>
												<td className='px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500'>
													{order._id.slice(-6)}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
													{order.address.fullName}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
													{currency}
													{order.amount.toFixed(2)}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
													{order.createdAt.slice(0, 10)}
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<span
														className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStateBgColor(
															order.state
														)}`}
													>
														{order.state}
													</span>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
													<div className='flex justify-end items-center gap-4'>
														<button
															onClick={() => setSelectedOrder(order)}
															className='text-blue-600 hover:text-blue-800'
															title='Voir les détails'
														>
															<Eye size={18} />
														</button>
														<button
															onClick={() => handleDeleteOrder(order._id)}
															className='text-red-600 hover:text-red-800'
															title='Supprimer la commande'
														>
															<Trash2 size={18} />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</main>
			{selectedOrder && (
				<OrderDetailsModal
					order={selectedOrder}
					onClose={() => setSelectedOrder(null)}
					onUpdateState={handleUpdateState}
				/>
			)}
			<Footer />
		</div>
	);
};

export default Orders;
