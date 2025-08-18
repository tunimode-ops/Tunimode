'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAppContext } from '@/context/AppContext';

const PRODUCTS_PER_PAGE = 10;

const ProductsList = () => {
	const { products, allCategories } = useAppContext();
	const searchParams = useSearchParams();
	const router = useRouter();

	const [searchText, setSearchText] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedShop, setSelectedShop] = useState('All');
	const [currentPage, setCurrentPage] = useState(1);

	// Read category & shop from URL query on mount
	useEffect(() => {
		const categoryFromUrl = searchParams.get('category');
		const shopFromUrl = searchParams.get('shop') || 'All';
		if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
		if (shopFromUrl) setSelectedShop(shopFromUrl);
	}, [searchParams]);

	const filteredProducts = useMemo(() => {
		return products.filter(product => {
			const matchesText =
				product.name.toLowerCase().includes(searchText.toLowerCase()) ||
				(product.description &&
					product.description.toLowerCase().includes(searchText.toLowerCase()));

			const matchesCategory =
				!selectedCategory || product.categories.includes(selectedCategory);

			const matchesShop =
				selectedShop === 'All' || product.shop === selectedShop;

			return matchesText && matchesCategory && matchesShop;
		});
	}, [products, searchText, selectedCategory, selectedShop]);

	// Pagination
	const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
	const paginatedProducts = useMemo(() => {
		const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
		const endIndex = startIndex + PRODUCTS_PER_PAGE;
		return filteredProducts.slice(startIndex, endIndex);
	}, [filteredProducts, currentPage]);

	const handlePageChange = page => {
		if (page < 1 || page > totalPages) return;
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Update URL query when shop changes
	const handleShopChange = shop => {
		setSelectedShop(shop);
		const params = new URLSearchParams(searchParams.toString());
		if (shop === 'All') params.delete('shop');
		else params.set('shop', shop);
		router.replace(`/all-products?${params.toString()}`);
	};

	return (
		<>
			<Navbar />
			<div className='flex flex-col items-start px-4 md:px-16 lg:px-32'>
				{/* Title */}
				<div className='flex flex-col items-start pt-12 mb-6'>
					<h1 className='text-3xl md:text-4xl font-bold text-gray-800'>
						{selectedShop} Produits
					</h1>
					<div className='w-20 h-1 bg-main-color-600 rounded-full mt-2'></div>
				</div>

				{/* Search & Filters */}
				<div className='flex flex-col md:flex-row items-start md:items-center gap-4 w-full mb-8 flex-wrap bg-white p-4 rounded-lg shadow-sm'>
					<input
						type='text'
						placeholder='Rechercher des produits...'
						value={searchText}
						onChange={e => setSearchText(e.target.value)}
						className='border border-gray-300 rounded px-4 py-2 w-full md:w-64 outline-none focus:ring-2 focus:ring-main-color-500'
					/>

					<select
						value={selectedCategory}
						onChange={e => setSelectedCategory(e.target.value)}
						className='border border-gray-300 rounded px-4 py-2 w-full md:w-48 outline-none focus:ring-2 focus:ring-main-color-500'
					>
						<option value=''>Toutes les catégories</option>
						{allCategories.map(category => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>

					<select
						value={selectedShop}
						onChange={e => handleShopChange(e.target.value)}
						className='border border-gray-300 rounded px-4 py-2 w-full md:w-48 outline-none focus:ring-2 focus:ring-main-color-500'
					>
						<option value='All'>Toutes les boutiques</option>
						<option value='Prêt à Porter'>Prêt à Porter</option>
						<option value='Fripe'>Fripe</option>
					</select>
				</div>

				{/* Products Grid */}
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8 w-full'>
					{paginatedProducts.length > 0 ? (
						paginatedProducts.map((product, index) => (
							<ProductCard
								key={index}
								product={product}
								className='transition-transform hover:scale-105 hover:shadow-lg'
							/>
						))
					) : (
						<p className='text-gray-500 col-span-full text-center text-lg'>
							Aucun produit trouvé.
						</p>
					)}
				</div>

				{/* Pagination Controls */}
				{totalPages > 1 && (
					<div className='flex justify-center gap-2 mb-12 flex-wrap'>
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							className='px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
							disabled={currentPage === 1}
						>
							Précédent
						</button>
						{[...Array(totalPages)].map((_, idx) => {
							const page = idx + 1;
							return (
								<button
									key={page}
									onClick={() => handlePageChange(page)}
									className={`px-3 py-1 border rounded ${
										currentPage === page
											? 'bg-main-color-600 text-white shadow-md'
											: 'hover:bg-gray-100'
									}`}
								>
									{page}
								</button>
							);
						})}
						<button
							onClick={() => handlePageChange(currentPage + 1)}
							className='px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
							disabled={currentPage === totalPages}
						>
							Suivant
						</button>
					</div>
				)}
			</div>
			<Footer />
		</>
	);
};

export default ProductsList;
