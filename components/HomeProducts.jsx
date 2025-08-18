import React from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '@/context/AppContext';

const HomeProducts = () => {
	const { products, router } = useAppContext();

	// Filter products by shop
	const shop1Products = products
		.filter(p => p.shop === 'Prêt à Porter')
		.slice(0, 10);
	const shop2Products = products.filter(p => p.shop === 'Fripe').slice(0, 10);

	return (
		<div className='flex flex-col items-center w-full px-4 md:px-16 pt-14 space-y-20'>
			{/* Prêt à Porter Products */}
			<div className='w-full'>
				<div className='flex flex-col md:flex-row items-center justify-between mb-6'>
					<h2 className='text-3xl font-bold text-main-color-600'>
						Produits Prêt à Porter
					</h2>
					<button
						onClick={() => router.push('/all-products?shop=Prêt à Porter')}
						className='mt-4 md:mt-0 px-6 py-2 bg-main-color-500 text-white rounded-lg hover:bg-main-color-600 transition'
					>
						Voir tout
					</button>
				</div>
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
					{shop1Products.length > 0 ? (
						shop1Products.map((product, idx) => (
							<ProductCard key={idx} product={product} />
						))
					) : (
						<p className='text-gray-500 col-span-full text-center'>
							Aucun produit disponible.
						</p>
					)}
				</div>
			</div>

			{/* Fripe Products */}
			<div className='w-full'>
				<div className='flex flex-col md:flex-row items-center justify-between mb-6'>
					<h2 className='text-3xl font-bold text-main-color-600'>
						Produits Fripe
					</h2>
					<button
						onClick={() => router.push('/all-products?shop=Fripe')}
						className='mt-4 md:mt-0 px-6 py-2 bg-main-color-500 text-white rounded-lg hover:bg-main-color-600 transition'
					>
						Voir tout
					</button>
				</div>
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
					{shop2Products.length > 0 ? (
						shop2Products.map((product, idx) => (
							<ProductCard key={idx} product={product} />
						))
					) : (
						<p className='text-gray-500 col-span-full text-center'>
							Aucun produit disponible.
						</p>
					)}
				</div>
			</div>

			{/* See More Products */}
			<div className='flex justify-center mt-8'>
				<button
					onClick={() => router.push('/all-products')}
					className='px-12 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition'
				>
					Voir plus de produits
				</button>
			</div>
		</div>
	);
};

export default HomeProducts;
