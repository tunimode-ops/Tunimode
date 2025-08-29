'use client';
import React, { useState } from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import CategoryManager from '@/components/seller/CategoryManager';

const AddProduct = () => {
	const { getToken } = useAppContext();
	const [files, setFiles] = useState([]);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [offerPrice, setOfferPrice] = useState('');
	const [quantity, setQuantity] = useState(0); // Add quantity state
	const [shop, setShop] = useState('Nouveau');
	const [options, setOptions] = useState([]);
	const [categoryData, setCategoryData] = useState({
		selectedCategories: [],
		newCategories: '',
	});

	const [loading, setLoading] = useState(false);

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true); // disable button

		const formData = new FormData();
		formData.append('name', name);
		formData.append('description', description);
		formData.append(
			'selectedCategories',
			JSON.stringify(categoryData.selectedCategories)
		);
		formData.append('newCategories', categoryData.newCategories);
		formData.append('price', price);
		formData.append('offerPrice', offerPrice);
		formData.append('quantity', quantity);
		formData.append('shop', shop);
		formData.append('options', JSON.stringify(options));
		files.forEach(file => formData.append('images', file));

		try {
			const token = await getToken();
			const { data } = await axios.post('/api/product/add', formData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (data.success) {
				toast.success(data.message);
				// reset form
				setFiles([]);
				setName('');
				setDescription('');
				setCategoryData({ selectedCategories: [], newCategories: '' });
				setPrice('');
				setOfferPrice('');
				setQuantity(0);
				setShop('Nouveau');
				setOptions([]);
			} else toast.error(data.message);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setLoading(false); // re-enable button
		}
	};
	return (
		<div className='flex-1 min-h-screen flex flex-col justify-between bg-gray-50'>
			<form
				onSubmit={handleSubmit}
				className='md:p-10 p-4 space-y-6 max-w-4xl mx-auto flex flex-col'
			>
				{/* Images */}
				<div>
					<p className='text-lg font-medium mb-2'>Images du produit</p>
					<div className='flex flex-wrap gap-3'>
						{[...Array(4)].map((_, i) => (
							<label key={i} className='w-24 h-24 relative cursor-pointer'>
								<input
									type='file'
									hidden
									onChange={e => {
										const updated = [...files];
										updated[i] = e.target.files[0];
										setFiles(updated);
									}}
								/>
								<Image
									src={
										files[i]
											? URL.createObjectURL(files[i])
											: assets.upload_area
									}
									alt=''
									fill
									className='object-cover rounded-md border border-gray-300'
								/>
							</label>
						))}
					</div>
				</div>

				{/* Name & Description */}
				<div className='flex flex-col gap-3'>
					<input
						type='text'
						placeholder='Nom du produit'
						className='border px-3 py-2 rounded w-full'
						value={name}
						onChange={e => setName(e.target.value)}
						required
					/>
					<textarea
						rows={4}
						placeholder='Description du produit'
						className='border px-3 py-2 rounded w-full resize-none'
						value={description}
						onChange={e => setDescription(e.target.value)}
						required
					/>
				</div>

				{/* Shop Selector */}
				<div className='flex flex-col gap-2'>
					<p className='text-base font-medium'>Boutique</p>
					<select
						value={shop}
						onChange={e => setShop(e.target.value)}
						className='border px-3 py-2 rounded w-full'
					>
						<option value='Nouveau'>Nouveau</option>
						<option value='Fripe'>Fripe</option>
					</select>
				</div>

				{/* Categories */}
				<div className='flex flex-col gap-2'>
					<p className='text-base font-medium'>Catégories</p>
					<CategoryManager onChange={setCategoryData} />
				</div>

				{/* Product Options */}
				<div className='border p-3 rounded flex flex-col gap-3'>
					<p className='text-base font-medium'>
						Options du produit (ex: Taille, Couleur)
					</p>
					{options.map((option, i) => (
						<div key={i} className='flex flex-col gap-2 border p-2 rounded'>
							<div className='flex gap-2 items-center'>
								<input
									type='text'
									placeholder="Nom de l'option"
									value={option.name}
									onChange={e => {
										const newOptions = [...options];
										newOptions[i].name = e.target.value;
										setOptions(newOptions);
									}}
									className='border px-3 py-2 rounded flex-grow'
								/>
								<button
									type='button'
									onClick={() =>
										setOptions(prev => prev.filter((_, idx) => idx !== i))
									}
									className='px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700'
								>
									Supprimer
								</button>
							</div>
							<div className='flex flex-wrap gap-2'>
								{option.values.map((val, idx) => (
									<span
										key={idx}
										className='flex items-center gap-1 bg-gray-100 text-gray-800 text-sm px-2.5 py-0.5 rounded-full'
									>
										{val}
										<button
											type='button'
											onClick={() => {
												const newOptions = [...options];
												newOptions[i].values = newOptions[i].values.filter(
													(_, id) => id !== idx
												);
												setOptions(newOptions);
											}}
										>
											&times;
										</button>
									</span>
								))}
								<input
									type='text'
									placeholder='Ajouter une valeur (séparée par des virgules)'
									className='border px-3 py-1 rounded flex-grow'
									onKeyPress={e => {
										if (e.key === 'Enter') {
											e.preventDefault();
											const newVals = e.target.value
												.split(',')
												.map(v => v.trim())
												.filter(v => v !== '');
											if (newVals.length) {
												const newOptions = [...options];
												newOptions[i].values = [
													...newOptions[i].values,
													...newVals,
												].filter(
													(v, idx, arr) =>
														arr.findIndex(
															t => t.toLowerCase() === v.toLowerCase()
														) === idx
												);
												setOptions(newOptions);
												e.target.value = '';
											}
										}
									}}
								/>
							</div>
						</div>
					))}
					<button
						type='button'
						onClick={() =>
							setOptions(prev => [...prev, { name: '', values: [] }])
						}
						className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2'
					>
						Ajouter une nouvelle option
					</button>
				</div>

				{/* Price & Offer */}
				<div className='flex flex-wrap gap-4'>
					<div className='flex flex-col gap-1 w-40'>
						<label className='text-base font-medium'>Prix</label>
						<input
							type='number'
							value={price}
							onChange={e => setPrice(e.target.value)}
							className='border px-3 py-2 rounded w-full'
							required
						/>
					</div>
					<div className='flex flex-col gap-1 w-40'>
						<label className='text-base font-medium'>Prix de l'offre</label>
						<input
							type='number'
							value={offerPrice}
							onChange={e => setOfferPrice(e.target.value)}
							className='border px-3 py-2 rounded w-full'
							required
						/>
					</div>
					<div className='flex flex-col gap-1 w-40'>
						<label className='text-base font-medium'>Quantité</label>
						<input
							type='number'
							value={quantity}
							onChange={e => setQuantity(Number(e.target.value))}
							className='border px-3 py-2 rounded w-full'
							required
							min='0'
						/>
					</div>
				</div>

				<button
					type='submit'
					className='px-6 py-2.5 bg-main-color-600 text-white font-medium rounded hover:bg-main-color-700 w-fit'
					disabled={loading} // disable while submitting
				>
					{loading ? 'Ajout en cours...' : 'Ajouter un produit'}
				</button>
			</form>
		</div>
	);
};

export default AddProduct;
