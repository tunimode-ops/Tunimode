import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import CategoryManager from './CategoryManager';
import { assets } from '@/assets/assets';

const EditProductModal = ({ product, isOpen, onClose, getToken, onUpdate }) => {
	const [name, setName] = useState(product.name);
	const [description, setDescription] = useState(product.description);
	const [price, setPrice] = useState(product.price);
	const [offerPrice, setOfferPrice] = useState(product.offerPrice);
	const [quantity, setQuantity] = useState(product.quantity); // Add quantity state
	const [shop, setShop] = useState(product.shop || 'Prêt à Porter');
	const [existingImages, setExistingImages] = useState(product.image || []);
	const [newImages, setNewImages] = useState([]);
	const [submitting, setSubmitting] = useState(false);
	const [options, setOptions] = useState(
		product.options?.length ? product.options : []
	);
	const [categoryData, setCategoryData] = useState({
		selectedCategories: product.categories || [],
		newCategories: '',
	});

	if (!isOpen) return null;

	const handleSubmit = async e => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const token = await getToken();
			const formData = new FormData();
			formData.append('productId', product._id);
			formData.append('name', name);
			formData.append('description', description);
			formData.append(
				'selectedCategories',
				JSON.stringify(categoryData.selectedCategories)
			);
			formData.append('newCategories', categoryData.newCategories);
			formData.append('price', price);
			formData.append('offerPrice', offerPrice);
			formData.append('quantity', quantity); // Append quantity
			formData.append('shop', shop);
			// Append existing images to keep
			existingImages.forEach(img =>
				formData.append('existingImages', JSON.stringify(img))
			); // Append newly selected images
			newImages.forEach(img => formData.append('newImages', img));
			// Append options as a JSON string
			formData.append('options', JSON.stringify(options));

			const { data } = await axios.put('/api/product/edit', formData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				toast.success('Product updated successfully');
				console.log('Updated Product:', data.updatedProduct);
				onUpdate(data.updatedProduct);
				onClose();
			} else {
				toast.error(data.message);
			}
		} catch (err) {
			toast.error(err.message);
			console.error(err);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
			<div className='bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6'>
				<h2 className='text-lg font-bold mb-4'>Modifier le produit</h2>
				<form className='flex flex-col gap-3' onSubmit={handleSubmit}>
					<input
						type='text'
						value={name}
						onChange={e => setName(e.target.value)}
						placeholder='Nom du produit'
						className='border px-3 py-2 rounded w-full'
					/>
					<textarea
						value={description}
						onChange={e => setDescription(e.target.value)}
						placeholder='Description'
						className='border px-3 py-2 rounded w-full'
						rows='3'
					/>

					{/* Shop Selector */}
					<div className='border p-3 rounded'>
						<label
							htmlFor='shop-select'
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							Boutique
						</label>
						<select
							id='shop-select'
							value={shop}
							onChange={e => setShop(e.target.value)}
							className='border px-3 py-2 rounded w-full'
						>
							<option value='Prêt à Porter'>Prêt à Porter</option>
							<option value='Fripe'>Fripe</option>
						</select>
					</div>

					{/* Category Management Section */}
					<div className='border p-3 rounded'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Catégories
						</label>
						<CategoryManager
							initialSelectedCategories={product.categories}
							onChange={setCategoryData}
						/>
					</div>
					<div className='border p-3 rounded'>
						<label
							htmlFor=''
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							Prix
						</label>
						<input
							type='number'
							value={price}
							onChange={e => setPrice(e.target.value)}
							placeholder='Prix'
							className='border px-3 py-2 rounded w-full'
						/>
					</div>
					<div className='border p-3 rounded'>
						<label
							htmlFor=''
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							Prix de l'offre
						</label>
						<input
							type='number'
							value={offerPrice}
							onChange={e => setOfferPrice(e.target.value)}
							placeholder="Prix de l\'offre"
							className='border px-3 py-2 rounded w-full'
						/>
					</div>
					<div className='border p-3 rounded'>
						<label
							htmlFor=''
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							Quantité
						</label>
						<input
							type='number'
							value={quantity}
							onChange={e => setQuantity(Number(e.target.value))}
							placeholder='Quantité'
							className='border px-3 py-2 rounded w-full'
							min='0'
						/>
					</div>

					{/* Product Options Management Section */}
					<div className='border p-3 rounded'>
						<label className='block text-base font-medium text-gray-700 mb-2'>
							Options du produit (ex: Taille, Couleur)
						</label>
						{options.map((option, optionIndex) => (
							<div
								key={optionIndex}
								className='flex flex-col gap-2 mb-3 p-2 border rounded'
							>
								<div className='flex items-center justify-between'>
									<input
										type='text'
										placeholder="Nom de l'option (ex: Taille)"
										value={option.name}
										onChange={e => {
											const newOptions = [...options];
											newOptions[optionIndex].name = e.target.value;
											setOptions(newOptions);
										}}
										className='border px-3 py-2 rounded w-full mr-2'
									/>
									<button
										type='button'
										onClick={() =>
											setOptions(prev =>
												prev.filter((_, i) => i !== optionIndex)
											)
										}
										className='bg-red-600 text-white rounded px-3 py-2 hover:bg-red-700'
									>
										Supprimer l'option
									</button>
								</div>
								<div className='flex flex-wrap gap-2 items-center'>
									{option.values.map((value, valueIndex) => (
										<span
											key={valueIndex}
											className='flex items-center bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full'
										>
											{value}
											<button
												type='button'
												onClick={() => {
													const newOptions = [...options];
													newOptions[optionIndex].values = newOptions[
														optionIndex
													].values.filter((_, i) => i !== valueIndex);
													setOptions(newOptions);
												}}
												className='ml-1 text-gray-800 hover:text-gray-900 focus:outline-none'
											>
												&times;
											</button>
										</span>
									))}
									<input
										type='text'
										placeholder='Ajouter une valeur (séparée par des virgules)'
										onKeyPress={e => {
											if (e.key === 'Enter') {
												e.preventDefault();
												const newValues = e.target.value
													.split(',')
													.map(v => v.trim())
													.filter(v => v !== '');
												if (newValues.length > 0) {
													const newOptions = [...options];
													newOptions[optionIndex].values = [
														...newOptions[optionIndex].values,
														...newValues,
													].filter(
														(v, i, a) =>
															a.findIndex(
																t => t.toLowerCase() === v.toLowerCase()
															) === i
													); // Prevent duplicates
													setOptions(newOptions);
													e.target.value = '';
												}
											}
										}}
										className='border px-3 py-2 rounded flex-grow'
									/>
								</div>
							</div>
						))}
						<button
							type='button'
							onClick={() =>
								setOptions(prev => [...prev, { name: '', values: [] }])
							}
							className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 mt-2'
						>
							Ajouter une nouvelle option
						</button>
					</div>
					{/* Display existing images */}
					<div className='border p-3 rounded'>
						<label className='block text-base font-medium text-gray-700 mb-2'>
							Images du produit
						</label>
						<div className='flex flex-wrap gap-2 mb-3'>
							{existingImages.map((img, index) =>
								// Ensure img is a valid string URL before rendering
								typeof img.url === 'string' && img.url ? (
									<div
										key={index}
										className='relative w-24 h-24 border rounded overflow-hidden'
									>
										<img
											src={img.url || assets.placeholder} // Added fallback
											alt={`Image du produit ${index}`}
											className='w-full h-full object-cover' // Use Tailwind for object-fit
										/>
										<button
											type='button'
											onClick={() =>
												setExistingImages(prev =>
													prev.filter((_, i) => i !== index)
												)
											}
											className='absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
										>
											&times;
										</button>
									</div>
								) : null
							)}
							{/* Display newly selected images */}
							{newImages.map((img, index) =>
								// Ensure img is a File object before creating URL, provide fallback for src
								img instanceof File ? (
									<div
										key={index}
										className='relative w-24 h-24 border rounded overflow-hidden'
									>
										<img
											src={img instanceof File ? URL.createObjectURL(img) : ''} // Added fallback
											alt={`Nouvelle image ${index}`}
											className='w-full h-full object-cover' // Use Tailwind for object-fit
										/>
										<button
											type='button'
											onClick={() =>
												setNewImages(prev => prev.filter((_, i) => i !== index))
											}
											className='absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
										>
											&times;
										</button>
									</div>
								) : null
							)}
						</div>
						<input
							type='file'
							multiple
							onChange={e =>
								setNewImages(prev => [...prev, ...Array.from(e.target.files)])
							}
							className='border px-3 py-2 rounded w-full'
						/>
					</div>
					<div className='flex justify-end gap-2 mt-3'>
						<button
							type='button'
							onClick={onClose}
							className='px-4 py-2 rounded bg-gray-300 hover:bg-gray-400'
						>
							Annuler
						</button>
						<button
							type='submit'
							disabled={submitting}
							className={`px-4 py-2 rounded text-white ${
								submitting
									? 'bg-gray-500 cursor-not-allowed'
									: 'bg-blue-600 hover:bg-blue-700'
							}`}
						>
							{submitting ? 'Mise à jour...' : 'Mettre à jour'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditProductModal;
