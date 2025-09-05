'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const categories = [
	{
		id: 1,
		key: 'kids',
		image: assets.kids, // replace with your image
		title: 'Enfants',
		description: 'Trouvez les meilleurs produits pour enfants.',
	},
	{
		id: 2,
		key: 'women',
		image: assets.woman, // replace with your image
		title: 'Femmes',
		description: 'Découvrez les dernières nouveautés pour femmes.',
	},
	{
		id: 3,
		key: 'men',
		image: assets.man, // replace with your image
		title: 'Hommes',
		description: 'Explorez les meilleurs produits pour hommes.',
	},
];

const FeaturedCategories = () => {
	const router = useRouter();

	const handleClick = categoryKey => {
		// Redirect to product-list page with category filter
		router.push(`/all-products?category=${categoryKey}`);
	};

	return (
		<div className='mt-14'>
			<div className='flex flex-col items-center'>
				<p className='text-3xl font-medium'>Acheter par catégorie</p>
				<div className='w-28 h-0.5 bg-main-color-600 mt-2'></div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4'>
				{categories.map(({ id, image, title, description, key }) => (
					<div key={id} className='relative group'>
						<Image
							src={image || assets.placeholder}
							alt={title}
							className='group-hover:brightness-75 transition duration-300 w-full h-auto object-cover'
						/>
						<div className='group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2'>
							<p className='font-medium text-xl lg:text-2xl'>{title}</p>
							<p className='text-sm lg:text-base leading-5 max-w-60'>
								{description}
							</p>
							<button
								onClick={() => handleClick(key)}
								className='flex items-center gap-1.5 bg-main-color-600 px-4 py-2 rounded'
							>
								Acheter {title}{' '}
								<Image
									className='h-3 w-3'
									src={assets.redirect_icon}
									alt='Icône de redirection'
									priority={false}
									loading='lazy'
								/>
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default FeaturedCategories;
