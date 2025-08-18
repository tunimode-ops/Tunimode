'use client';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

const CategoryManager = ({ onChange, initialSelectedCategories = [] }) => {
	const [isMounted, setIsMounted] = useState(false);
	const [existingCategories, setExistingCategories] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState(
		initialSelectedCategories.map(c => ({ value: c, label: c }))
	);
	const [newCategories, setNewCategories] = useState('');

	useEffect(() => {
		setIsMounted(true);
		const fetchCategories = async () => {
			try {
				const response = await fetch('/api/product/categories');
				const data = await response.json();
				setExistingCategories(
					data.categories.map(c => ({ value: c, label: c }))
				);
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		onChange({
			selectedCategories: selectedCategories.map(c => c.value),
			newCategories,
		});
	}, [selectedCategories, newCategories, onChange]);

	if (!isMounted) {
		return null;
	}

	return (
		<div className='space-y-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Catégories existantes
				</label>
				<Select
					isMulti
					options={existingCategories}
					value={selectedCategories}
					onChange={setSelectedCategories}
					className='mt-1'
					instanceId='category-select'
				/>
			</div>
			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Nouvelles catégories (séparées par des virgules)
				</label>
				<input
					type='text'
					value={newCategories}
					onChange={e => setNewCategories(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
				/>
			</div>
		</div>
	);
};

export default CategoryManager;
