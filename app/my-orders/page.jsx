'use client';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PackageCheck, ShoppingBag } from 'lucide-react';
import { assets } from '@/assets/assets';

const MyOrders = () => {
	const { currency, getToken, user } = useAppContext();

	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchOrders = async () => {
		try {
			const token = await getToken();
			const { data } = await axios.get('/api/order/list', {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (data.success) {
				setOrders(data.orders.reverse());
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message || 'Failed to fetch orders');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			fetchOrders();
		}
	}, [user]);

	const getStateInfo = state => {
		switch (state) {
			case 'pending':
				return {
					text: 'En attente',
					color: 'bg-yellow-100 text-yellow-800',
					icon: <ShoppingBag size={20} className='text-yellow-600' />,
				};
			case 'processing':
				return {
					text: 'En traitement',
					color: 'bg-blue-100 text-blue-800',
					icon: <ShoppingBag size={20} className='text-blue-600' />,
				};
			case 'shipped':
				return {
					text: 'Expédiée',
					color: 'bg-indigo-100 text-indigo-800',
					icon: <PackageCheck size={20} className='text-indigo-600' />,
				};
			case 'delivered':
				return {
					text: 'Livrée',
					color: 'bg-green-100 text-green-800',
					icon: <PackageCheck size={20} className='text-green-600' />,
				};
			case 'cancelled':
				return {
					text: 'Annulée',
					color: 'bg-red-100 text-red-800',
					icon: <ShoppingBag size={20} className='text-red-600' />,
				};
			default:
				return {
					text: 'Inconnu',
					color: 'bg-gray-100 text-gray-800',
					icon: <ShoppingBag size={20} className='text-gray-600' />,
				};
		}
	};

	return (
		<>
			<Navbar />
			<main className='bg-gray-50 min-h-screen py-8 sm:py-12'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<h1 className='text-3xl sm:text-4xl font-bold text-gray-800 mb-8'>
						Mes Commandes
					</h1>
					{loading ? (
						<Loading />
					) : orders.length === 0 ? (
						<div className='text-center py-16'>
							<ShoppingBag size={48} className='mx-auto text-gray-400' />
							<h2 className='mt-4 text-xl font-semibold text-gray-700'>
								Aucune commande pour le moment
							</h2>
							<p className='mt-2 text-gray-500'>
								Il semble que vous n'ayez pas encore passé de commandes.
							</p>
						</div>
					) : (
						<div className='space-y-6'>
							{orders.map(order => {
								const stateInfo = getStateInfo(order.state);
								return (
									<div
										key={order._id}
										className='bg-white shadow-md rounded-lg overflow-hidden'
									>
										<div className='p-4 sm:p-6 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center'>
											<div>
												<p className='font-mono text-sm text-gray-600'>
													Commande #{order._id.slice(-8)}
												</p>
												<p className='text-sm text-gray-500 mt-1'>
													Passée le {order.createdAt.slice(0, 10)}
												</p>
											</div>
											<div className='mt-4 sm:mt-0 flex items-center gap-3'>
												{stateInfo.icon}
												<span
													className={`px-3 py-1 text-sm font-semibold rounded-full ${stateInfo.color}`}
												>
													{stateInfo.text}
												</span>
											</div>
										</div>
										<div className='p-4 sm:p-6'>
											<div className='space-y-4'>
												{order.items.map(item => (
													<div
														key={item.product?._id}
														className='flex items-start gap-4'
													>
														<img
															src={
																item.product?.image?.[0]?.url ||
																assets.placeholder
															}
															alt={item.product?.name}
															className='w-20 h-20 object-cover rounded-md'
														/>
														<div className='flex-1'>
															<h3 className='font-semibold text-gray-800'>
																{item.product?.name}
															</h3>
															<p className='text-sm text-gray-500'>
																Qté: {item.quantity}
															</p>
														</div>
														<p className='text-right font-semibold text-gray-800'>
															{(
																(item?.product?.offerPrice <
																	item?.product?.price &&
																item?.product?.offerPrice > 0
																	? item?.product?.offerPrice
																	: item?.product?.price) * item.quantity
															).toFixed(2)}
															{currency}
														</p>
													</div>
												))}
											</div>
										</div>
										<div className='p-4 sm:p-6 bg-gray-50 border-t text-right'>
											<p className='text-xl font-bold text-gray-800'>
												Total:{' '}
												<small className='text-sm text-gray-500'>
													(+ {process.env.NEXT_PUBLIC_SHIPPING_COST}
													{' TND '}Frais de livraison ){' '}
												</small>
												{currency}
												{order.amount.toFixed(2)}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</main>
			<Footer />
		</>
	);
};

export default MyOrders;
