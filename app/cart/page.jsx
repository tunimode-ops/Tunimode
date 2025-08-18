'use client';
import React from 'react';
import { assets } from '@/assets/assets';
import OrderSummary from '@/components/OrderSummary';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { useAppContext } from '@/context/AppContext';

const Cart = () => {
	const {
		products,
		router,
		cartItems,
		addToCart,
		updateCartQuantity,
		getCartCount,
		currency,
	} = useAppContext();
	console.log('cartItems', cartItems);
	return (
		<>
			<Navbar />
			<div className='flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20'>
				<div className='flex-1'>
					<div className='flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6'>
						<p className='text-2xl md:text-3xl text-gray-500'>
							Votre{' '}
							<span className='font-medium text-main-color-600'>Panier</span>
						</p>
						<p className='text-lg md:text-xl text-gray-500/80'>
							{getCartCount()} Articles
						</p>
					</div>
					<div className='overflow-x-auto'>
						<table className='min-w-full table-auto'>
							<thead className='text-left'>
								<tr>
									<th className='text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium'>
										Détails du produit
									</th>
									<th className='pb-6 md:px-4 px-1 text-gray-600 font-medium'>
										Prix
									</th>
									<th className='pb-6 md:px-4 px-1 text-gray-600 font-medium'>
										Quantité
									</th>
									<th className='pb-6 md:px-4 px-1 text-gray-600 font-medium'>
										Sous-total
									</th>
								</tr>
							</thead>
							<tbody>
								{Object.keys(cartItems).map(itemKey => {
									let itemId = JSON.parse(itemKey)['itemId'];
									let selectedOptions = JSON.parse(itemKey)['selectedOptions'];
									const product = products.find(
										product => product._id === itemId
									);

									if (!product || cartItems[itemKey] <= 0) return null;

									return (
										<tr key={itemId}>
											<td className='flex items-center gap-4 py-4 md:px-4 px-1'>
												<div>
													<div className='rounded-lg overflow-hidden bg-gray-500/10 p-2'>
														<Image
															src={
																product?.image?.[0]?.url || assets.placeholder
															}
															alt={product.name}
															className='w-16 h-auto object-cover mix-blend-multiply'
															width={1280}
															height={720}
														/>
													</div>
													<button
														className='md:hidden text-xs text-main-color-600 mt-1'
														onClick={() => updateCartQuantity(itemKey, 0)}
													>
														Supprimer
													</button>
												</div>
												<div className='text-sm hidden md:block'>
													<p className='text-gray-800'>{product.name}</p>
													{Object.keys(selectedOptions).length > 0 && (
														<div className='text-xs text-gray-500 mt-1'>
															{Object.entries(selectedOptions).map(
																([name, value]) => (
																	<p key={name}>
																		{name}: {value}
																	</p>
																)
															)}
														</div>
													)}
													<button
														className='text-xs text-main-color-600 mt-1'
														onClick={() => updateCartQuantity(itemKey, 0)}
													>
														Supprimer
													</button>
												</div>
											</td>
											<td className='py-4 md:px-4 px-1 text-gray-600'>
												{product.offerPrice < product.price &&
												product.offerPrice > 0
													? product.offerPrice
													: product.price}
												<small className='text-sm text-gray-500 ml-1'>
													<b className='text-main-color-900'>{currency}</b>
												</small>
											</td>
											<td className='py-4 md:px-4 px-1'>
												<div className='flex items-center md:gap-2 gap-1'>
													<button
														onClick={() =>
															updateCartQuantity(
																itemKey,
																cartItems[itemKey] - 1
															)
														}
														disabled={cartItems[itemKey] <= 1}
													>
														<Image
															src={assets.decrease_arrow}
															alt='decrease_arrow'
															className='w-4 h-4'
														/>
													</button>
													<input
														onChange={e =>
															updateCartQuantity(
																itemKey,
																Number(e.target.value)
															)
														}
														type='number'
														value={cartItems[itemKey]}
														className='w-8 border text-center appearance-none'
														min='1'
														max={product.quantity}
													></input>
													<button
														onClick={() => addToCart(itemId, selectedOptions)}
														disabled={cartItems[itemKey] >= product.quantity}
													>
														<Image
															src={assets.increase_arrow}
															alt='increase_arrow'
															className='w-4 h-4'
														/>
													</button>
												</div>
											</td>
											<td className='py-4 md:px-4 px-1 text-gray-600'>
												{(
													(product.offerPrice < product.price &&
													product.offerPrice > 0
														? product.offerPrice
														: product.price) * cartItems[itemKey]
												).toFixed(2)}
												<small className='text-sm text-gray-500 ml-1'>
													<b className='text-main-color-900'>{currency}</b>
												</small>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
					<button
						onClick={() => router.push('/all-products')}
						className='group flex items-center mt-6 gap-2 text-main-color-600'
					>
						<Image
							className='group-hover:-translate-x-1 transition'
							src={assets.arrow_right_icon_colored}
							alt='arrow_right_icon_colored'
						/>
						Continuer vos achats
					</button>
				</div>
				<OrderSummary />
			</div>
		</>
	);
};

export default Cart;
