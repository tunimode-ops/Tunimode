'use client';
import React from 'react';
import { X } from 'lucide-react';
import { assets } from '@/assets/assets';

const OrderDetailsModal = ({ order, onClose, onUpdateState }) => {
	if (!order) return null;

	const handleStateChange = e => {
		onUpdateState(order._id, e.target.value);
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
				<div className='p-6 border-b sticky top-0 bg-white'>
					<div className='flex justify-between items-center'>
						<h2 className='text-2xl font-semibold text-gray-800'>
							Détails de la commande
						</h2>
						<button
							onClick={onClose}
							className='text-gray-500 hover:text-gray-800'
						>
							<X size={24} />
						</button>
					</div>
					<p className='text-sm text-gray-500 mt-1'>
						ID de commande: {order._id}
					</p>
				</div>

				<div className='p-6 space-y-6'>
					{/* Customer & Address Section */}
					<div className='grid md:grid-cols-2 gap-6'>
						<div>
							<h3 className='font-semibold text-lg text-gray-700 mb-2'>
								Client
							</h3>
							<p className='text-gray-600'>{order.address.fullName}</p>
							<p className='text-gray-600'>{order.address.phoneNumber}</p>
						</div>
						<div>
							<h3 className='font-semibold text-lg text-gray-700 mb-2'>
								Adresse de livraison
							</h3>
							<p className='text-gray-600'>{order.address.area}</p>
							<p className='text-gray-600'>{`${order.address.city}, ${order.address.state}`}</p>
						</div>
					</div>

					{/* Order State & Dates Section */}
					<div className='grid md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg'>
						<div>
							<h3 className='font-semibold text-lg text-gray-700 mb-2'>
								État de la commande
							</h3>
							<select
								value={order.state}
								onChange={handleStateChange}
								className='w-full p-2 border rounded-md bg-white'
							>
								<option value='pending'>En attente</option>
								<option value='processing'>En traitement</option>
								<option value='shipped'>Expédiée</option>
								<option value='delivered'>Livrée</option>
								<option value='cancelled'>Annulée</option>
							</select>
						</div>
						<div>
							<h3 className='font-semibold text-lg text-gray-700 mb-2'>
								Dates
							</h3>
							<p className='text-sm text-gray-600'>
								Créée: {order.createdAt.slice(0, 10)}
							</p>
							<p className='text-sm text-gray-600'>
								Mise à jour: {order.updatedAt.slice(0, 10)}
							</p>
						</div>
					</div>

					{/* Items Section */}
					<div>
						<h3 className='font-semibold text-lg text-gray-700 mb-2'>
							Articles ({order.items.length})
						</h3>
						<div className='space-y-4'>
							{order.items.map((item, index) => (
								<div
									key={index}
									className='flex items-center justify-between p-3 bg-white rounded-md border'
								>
									<div className='flex items-center gap-4'>
										<img
											src={item.product?.image?.[0]?.url || assets.placeholder}
											alt={item.product.name}
											className='w-16 h-16 object-cover rounded'
										/>
										<div>
											<p className='font-medium text-gray-800'>
												{item.product.name}
											</p>
											<p className='text-sm text-gray-500'>
												Quantité: {item.quantity}
											</p>
										</div>
									</div>
									<p className='font-semibold text-gray-800'>
										${(item.product.price * item.quantity).toFixed(2)}
									</p>
								</div>
							))}
						</div>
					</div>

					{/* Total Price Section */}
					<div className='text-right pt-4 border-t'>
						<p className='text-2xl font-bold text-gray-800'>
							Total: ${order.amount.toFixed(2)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetailsModal;
