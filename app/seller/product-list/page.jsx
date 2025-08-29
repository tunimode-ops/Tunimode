'use client';

import React, { useEffect, useState, useRef } from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import Footer from '@/components/seller/Footer';
import Loading from '@/components/Loading';
import axios from 'axios';
import toast from 'react-hot-toast';
import EditProductModal from '@/components/seller/EditProductModal';

const ProductList = () => {
	const { router, getToken, user, allCategories, currency } = useAppContext();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [fetching, setFetching] = useState(false);
	const [deletingId, setDeletingId] = useState(null);
	const [editingProduct, setEditingProduct] = useState(null);

	const [searchText, setSearchText] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedShop, setSelectedShop] = useState('All');
	const [sortOrder, setSortOrder] = useState('newest');

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalProducts, setTotalProducts] = useState(0);
	const productsPerPage = 10;

	// Debounce search input
	const debounceTimer = useRef(null);
	const [debouncedSearch, setDebouncedSearch] = useState('');

	useEffect(() => {
		clearTimeout(debounceTimer.current);
		debounceTimer.current = setTimeout(() => {
			setDebouncedSearch(searchText);
			setCurrentPage(1); // reset page on search
		}, 500);
	}, [searchText]);

	const fetchSellerProduct = async () => {
		try {
			if (!products.length) setLoading(true);
			else setFetching(true);

			const token = await getToken();
			const params = new URLSearchParams();
			if (debouncedSearch) params.append('search', debouncedSearch);
			if (selectedCategory) params.append('category', selectedCategory);
			if (selectedShop !== 'All') params.append('shop', selectedShop);
			if (sortOrder) params.append('sort', sortOrder);
			params.append('page', currentPage);
			params.append('limit', productsPerPage);

			const { data } = await axios.get(
				`/api/product/seller-list?${params.toString()}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (data.success) {
				setProducts(data.products);
				setTotalProducts(data.totalProducts);
				setTotalPages(data.totalPages);
			} else {
				toast.error(data.message);
			}
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false);
			setFetching(false);
		}
	};

	useEffect(() => {
		if (user) fetchSellerProduct();
	}, [
		user,
		debouncedSearch,
		selectedCategory,
		selectedShop,
		sortOrder,
		currentPage,
	]);

	const handleRemove = async id => {
		if (!confirm('Are you sure you want to remove this product?')) return;
		try {
			setDeletingId(id);
			const token = await getToken();
			const { data } = await axios.delete('/api/product/delete', {
				headers: { Authorization: `Bearer ${token}` },
				data: { productId: id },
			});
			if (data.success) {
				toast.success(data.message);
				fetchSellerProduct();
			} else toast.error(data.message);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setDeletingId(null);
		}
	};

	const handlePageChange = page => {
		if (page >= 1 && page <= totalPages) setCurrentPage(page);
	};

	return (
		<div className='flex-1 min-h-screen flex flex-col justify-between bg-gray-50'>
			{loading ? (
				<Loading />
			) : (
				<div className='w-full p-4 md:p-10'>
					<h2 className='text-2xl md:text-3xl font-semibold mb-2'>
						Tous les produits
					</h2>
					<p className='text-gray-500 mb-4'>
						Total des produits: <b>{totalProducts}</b>
						{fetching && (
							<span className='ml-2 text-gray-400'>(Chargement...)</span>
						)}
					</p>

					{/* Filters */}
					<div className='flex flex-col md:flex-row gap-4 items-start md:items-center mb-6 flex-wrap'>
						<input
							type='text'
							placeholder='Rechercher des produits...'
							value={searchText}
							onChange={e => setSearchText(e.target.value)}
							className='border px-3 py-2 rounded w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-main-color-500'
						/>
						<select
							value={selectedCategory}
							onChange={e => setSelectedCategory(e.target.value)}
							className='border px-3 py-2 rounded w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-main-color-500'
						>
							<option value=''>Toutes les catégories</option>
							{allCategories.map(cat => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select>
						<select
							value={selectedShop}
							onChange={e => setSelectedShop(e.target.value)}
							className='border px-3 py-2 rounded w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-main-color-500'
						>
							<option value='All'>Toutes les boutiques</option>
							<option value='Nouveau'>Nouveau</option>
							<option value='Fripe'>Fripe</option>
						</select>
						<select
							value={sortOrder}
							onChange={e => setSortOrder(e.target.value)}
							className='border px-3 py-2 rounded w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-main-color-500'
						>
							<option value='newest'>Les plus récents</option>
							<option value='oldest'>Les plus anciens</option>
							<option value='lowprice'>Prix le plus bas</option>
							<option value='highprice'>Prix le plus élevé</option>
						</select>
					</div>

					{/* Products Table */}
					<div className='overflow-x-auto'>
						<table className='min-w-full bg-white rounded-md shadow-md divide-y divide-gray-200'>
							<thead className='bg-gray-100 text-gray-700'>
								<tr>
									<th className='px-4 py-3 text-left'>Produit</th>
									<th className='px-4 py-3 text-left hidden sm:table-cell'>
										Catégories
									</th>
									<th className='px-4 py-3 text-left'>Prix</th>
									<th className='px-4 py-3 text-left'>Stock</th>
									<th className='px-4 py-3 text-left'>Boutique</th>
									<th className='px-4 py-3 text-center'>Actions</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-200'>
								{products.map(product => (
									<tr key={product._id} className='hover:bg-gray-50'>
										<td className='px-4 py-3 flex items-center space-x-3'>
											<div className='w-16 h-16 relative flex-shrink-0 rounded-md overflow-hidden bg-gray-200'>
												{product?.image?.[0]?.url && (
													<Image
														src={product?.image?.[0]?.url || assets.placeholder}
														alt={product.name}
														fill
														className='object-cover'
													/>
												)}
											</div>
											<span className='truncate'>{product.name}</span>
										</td>
										<td className='px-4 py-3 hidden sm:table-cell'>
											{product.categories.join(', ')}
										</td>
										<td className='px-4 py-3'>
											{product.offerPrice}
											<small className='text-sm text-gray-500 ml-1'>
												<b className='text-main-color-900'>{currency}</b>
											</small>
										</td>
										<td className='px-4 py-3'>{product.quantity}</td>
										<td className='px-4 py-3'>{product.shop}</td>
										<td className='px-4 py-3 flex flex-wrap justify-center gap-2'>
											<button
												onClick={() => router.push(`/product/${product._id}`)}
												className='flex items-center gap-1 px-2 py-1 bg-main-color-600 text-white rounded-md hover:bg-main-color-700'
											>
												Visiter
											</button>
											<button
												onClick={() => setEditingProduct(product)}
												className='px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700'
											>
												Modifier
											</button>
											<button
												onClick={() => handleRemove(product._id)}
												disabled={deletingId === product._id}
												className={`px-2 py-1 rounded-md text-white ${
													deletingId === product._id
														? 'bg-red-400 cursor-not-allowed'
														: 'bg-red-600 hover:bg-red-700'
												}`}
											>
												{deletingId === product._id
													? 'Suppression...'
													: 'Supprimer'}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>

						{products.length === 0 && (
							<p className='text-gray-500 text-center mt-6'>
								Aucun produit trouvé.
							</p>
						)}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className='flex justify-center mt-6 space-x-2'>
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50'
							>
								Précédent
							</button>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
								<button
									key={page}
									onClick={() => handlePageChange(page)}
									className={`px-3 py-1 rounded hover:bg-gray-300 ${
										currentPage === page
											? 'bg-main-color-600 text-white'
											: 'bg-gray-200'
									}`}
								>
									{page}
								</button>
							))}
							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className='px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50'
							>
								Suivant
							</button>
						</div>
					)}
				</div>
			)}

			{editingProduct && (
				<EditProductModal
					product={editingProduct}
					isOpen={!!editingProduct}
					onClose={() => setEditingProduct(null)}
					getToken={getToken}
					onUpdate={updatedProduct =>
						setProducts(prev =>
							prev.map(p => (p._id === updatedProduct._id ? updatedProduct : p))
						)
					}
				/>
			)}

			<Footer />
		</div>
	);
};

export default ProductList;
