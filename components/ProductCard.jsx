import React, { useState } from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {
	const { currency, router, addToCart } = useAppContext();
	const [loading, setLoading] = useState(false); // new state
	const isOutOfStock = product.quantity === 0;

	const handleClick = e => {
		if (isOutOfStock) {
			e.preventDefault();
			return;
		}
		router.push('/product/' + product._id);
		window.scrollTo(0, 0);
	};

	const handleAddToCart = async e => {
		e.stopPropagation(); // prevent card click
		if (isOutOfStock || loading) return; // block if out of stock or loading
		setLoading(true);
		try {
			await addToCart(product._id, {});
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			onClick={handleClick}
			className={`flex flex-col items-start gap-2 max-w-[220px] w-full group ${
				isOutOfStock ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
			}`}
		>
			{/* Product Image */}
			<div className='relative bg-gray-100 rounded-xl overflow-hidden w-full h-52 flex items-center justify-center shadow-sm hover:shadow-lg transition'>
				<Image
					src={product?.image?.[0]?.url || assets.placeholder}
					alt={product.name}
					className='object-contain w-full h-full transition-transform duration-300 group-hover:scale-105'
					width={800}
					height={800}
				/>
				{isOutOfStock && (
					<div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
						<span className='text-white text-lg font-bold'>
							En rupture de stock
						</span>
					</div>
				)}
				{/* Wishlist / Add to Cart Button */}
				<button
					className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition ${
						isOutOfStock || loading
							? 'bg-gray-200 cursor-not-allowed'
							: 'bg-white hover:bg-main-color-100'
					}`}
					onClick={handleAddToCart}
					disabled={isOutOfStock || loading}
				>
					<Image
						className='h-4 w-4'
						src={assets.heart_icon}
						alt='icône de cœur'
					/>
				</button>
			</div>

			{/* Product Info */}
			<div className='flex flex-col gap-1 w-full'>
				<p className='text-sm md:text-base font-semibold truncate'>
					{product.name}
				</p>
				{product.shop && (
					<p className='text-xs text-main-color-600 font-medium truncate'>
						{product.shop}
					</p>
				)}
				{product.categories?.length > 0 && (
					<p className='text-xs text-gray-500/80 truncate'>
						{product.categories.join(', ')}
					</p>
				)}
				<p className='text-base font-bold mt-1'>
					{product.offerPrice > 0 ? product.offerPrice : product.price}
					<small className='text-sm text-gray-500 ml-1'>
						<b className='font-bold text-main-color-900'>{currency}</b>
					</small>
				</p>
			</div>

			{/* Buy Now Button */}
			<button
				onClick={handleClick}
				disabled={isOutOfStock || loading}
				className={`mt-2 w-full px-4 py-2 text-xs text-gray-700 border border-gray-300 rounded-full transition ${
					isOutOfStock || loading
						? 'bg-gray-200 cursor-not-allowed'
						: 'hover:bg-main-color-100'
				}`}
			>
				{loading ? 'Ajout en cours...' : 'Voir le produit'}
			</button>
		</div>
	);
};

export default ProductCard;
