import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const OrderSummary = () => {
	const {
		currency,
		router,
		getCartCount,
		getCartAmount,
		getToken,
		user,
		cartItems,
		setCartItems,
	} = useAppContext();
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [userAddresses, setUserAddresses] = useState([]);
	const [isPlacingOrder, setIsPlacingOrder] = useState(false);

	const fetchUserAddresses = async () => {
		try {
			const token = await getToken();

			const { data } = await axios.get('/api/user/get-address', {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log(data);
			if (data.success) {
				setUserAddresses(data.addresses || []);
				if (data.addresses.length > 0) {
					setSelectedAddress(data.addresses[0]);
				}
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const handleAddressSelect = address => {
		setSelectedAddress(address);
		setIsDropdownOpen(false);
	};

	const createOrder = async () => {
		if (isPlacingOrder) return; // ✅ prevent multiple clicks
		setIsPlacingOrder(true);
		try {
			if (!selectedAddress) {
				toast.error('Please select an address');
				return;
			}
			const token = await getToken();

			let cartItemsArray = Object.keys(cartItems).map(itemKey => {
				let itemId = JSON.parse(itemKey)['itemId'];
				let selectedOptions = JSON.parse(itemKey)['selectedOptions'];
				return {
					product: itemId,
					quantity: cartItems[itemKey],
					selectedOptions: selectedOptions || [],
				};
			});
			cartItemsArray = cartItemsArray.filter(item => item.quantity > 0);
			console.log(cartItemsArray);
			if (cartItemsArray.length === 0) {
				toast.error('Cart is empty');
				return;
			}

			const { data } = await axios.post(
				'/api/order/create',
				{
					items: cartItemsArray,
					address: selectedAddress._id,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			if (data.success) {
				toast.success(data.message);
				setCartItems({});
				router.push('/order-placed');
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsPlacingOrder(false); // ✅ re-enable button if something goes wrong
		}
	};

	useEffect(() => {
		if (user) {
			fetchUserAddresses();
		}
	}, [user]);
	useEffect(() => {}, [cartItems]);
	const shippingFees =
		getCartAmount() > 300 ? 0 : process.env.NEXT_PUBLIC_SHIPPING_COST || 6;
	return (
		<div className='w-full md:w-96 bg-gray-500/5 p-5'>
			<h2 className='text-xl md:text-2xl font-medium text-gray-700'>
				Récapitulatif de la commande
			</h2>
			<hr className='border-gray-500/30 my-5' />
			<div className='space-y-6'>
				<div>
					<label className='text-base font-medium uppercase text-gray-600 block mb-2'>
						Sélectionner l'adresse
					</label>
					<div className='relative inline-block w-full text-sm border'>
						<button
							className='peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none'
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						>
							<span>
								{selectedAddress
									? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
									: "Sélectionner l'adresse"}
							</span>
							<svg
								className={`w-5 h-5 inline float-right transition-transform duration-200 ${
									isDropdownOpen ? 'rotate-0' : '-rotate-90'
								}`}
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke='#6B7280'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M19 9l-7 7-7-7'
								/>
							</svg>
						</button>

						{isDropdownOpen && (
							<ul className='absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5'>
								{userAddresses.map((address, index) => (
									<li
										key={index}
										className='px-4 py-2 hover:bg-gray-500/10 cursor-pointer'
										onClick={() => handleAddressSelect(address)}
									>
										{address.fullName}, {address.area}, {address.city},{' '}
										{address.state}
									</li>
								))}
								<li
									onClick={() => router.push('/add-address')}
									className='px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center'
								>
									+ Ajouter une nouvelle adresse
								</li>
							</ul>
						)}
					</div>
				</div>

				<hr className='border-gray-500/30 my-5' />

				<div className='space-y-4'>
					<div className='flex justify-between text-base font-medium'>
						<p className='uppercase text-gray-600'>Articles {getCartCount()}</p>
						<p className='text-gray-800'>
							{getCartAmount()}
							<small className='text-sm text-gray-500'>
								<b className='font-bold text-main-color-900'>{currency}</b>
							</small>
						</p>
					</div>
					<div className='flex justify-between'>
						<p className='text-gray-600'>Frais de livraison</p>
						{shippingFees == 0 ? (
							<p className='font-medium text-gray-800'>Gratuit</p>
						) : (
							<div className='flex justify-between items-baseline'>
								<p className='text-lg font-medium text-gray-800'>
									{shippingFees}
								</p>
								<small className='text-sm text-gray-500 ml-1'>
									<b className='text-main-color-900'>{currency}</b>
								</small>
							</div>
						)}
					</div>
					<div className='flex justify-between text-lg md:text-xl font-medium border-t pt-3'>
						<p>Total</p>
						<p>
							{Number(getCartAmount()) + Number(shippingFees)}
							<small className='text-sm text-gray-500'>
								<b className='font-bold text-main-color-900'>{currency}</b>
							</small>
						</p>
					</div>
				</div>
			</div>

			<button
				onClick={createOrder}
				disabled={isPlacingOrder} // ✅ disable while placing
				className={`w-full py-3 mt-5 text-white transition ${
					isPlacingOrder
						? 'bg-gray-400 cursor-not-allowed'
						: 'bg-main-color-600 hover:bg-main-color-700'
				}`}
			>
				{isPlacingOrder ? 'Passer la commande...' : 'Passer la commande'}
			</button>
		</div>
	);
};

export default OrderSummary;
