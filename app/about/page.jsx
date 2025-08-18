// app/about/page.jsx
'use client';
import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { assets } from '@/assets/assets';

export default function AboutPage() {
	return (
		<>
			<Navbar />
			<div className='min-h-screen bg-white text-gray-800'>
				{/* Hero Section */}
				<section className='relative flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 py-16 bg-gradient-to-r from-main-color-500/90 to-main-color-700/90 text-white rounded-b-3xl shadow-lg'>
					<div className='flex-1 text-center md:text-left'>
						<h1 className='text-4xl md:text-5xl font-extrabold leading-tight'>
							À propos de <span className='text-yellow-300'>Tunimode</span>
						</h1>
						<p className='mt-6 text-lg md:text-xl max-w-lg mx-auto md:mx-0'>
							Nous vous proposons les meilleurs produits, sélectionnés avec
							passion et conçus pour la vie moderne. Notre mission est de rendre
							le shopping simple, agréable et élégant.
						</p>
					</div>
					<div className='flex-1 mt-10 md:mt-0 flex justify-center'>
						<Image
							src={assets.placeholder} // 👉 replace with your image
							alt='Tunimode About'
							width={400}
							height={400}
							className='rounded-2xl shadow-lg'
						/>
					</div>
				</section>

				{/* Story Section */}
				<section className='px-6 md:px-16 lg:px-24 py-20'>
					<h2 className='text-3xl md:text-4xl font-bold text-center mb-10 text-main-color-600'>
						Notre Histoire
					</h2>
					<p className='max-w-3xl mx-auto text-center text-lg text-gray-600 leading-relaxed'>
						Tunimode a été fondée avec la conviction que le shopping doit être
						simple et amusant. De modestes débuts, nous sommes devenus une
						marque axée sur la communauté, servant des milliers de clients
						satisfaits à travers le monde. Notre parcours est alimenté par la
						créativité, l'innovation et un engagement envers la qualité.
					</p>
				</section>

				{/* Mission Section */}
				<section className='px-6 md:px-16 lg:px-24 py-20 bg-gray-50 rounded-3xl'>
					<div className='grid md:grid-cols-2 gap-12 items-center'>
						<Image
							src={assets.placeholder} // 👉 replace with your image
							alt='Our Mission'
							width={500}
							height={350}
							className='rounded-2xl shadow-md'
						/>
						<div>
							<h2 className='text-3xl md:text-4xl font-bold mb-6 text-main-color-600'>
								Notre Mission
							</h2>
							<p className='text-lg text-gray-600 leading-relaxed'>
								Nous visons à offrir non seulement des produits, mais des
								expériences qui inspirent nos clients. Chaque article que nous
								présentons est soigneusement sélectionné pour garantir qu'il
								répond à nos normes élevées de qualité, de design et de
								fonctionnalité.
							</p>
						</div>
					</div>
				</section>

				{/* Call To Action */}
				<section className='text-center py-16 px-6 md:px-16 lg:px-24'>
					<h2 className='text-3xl md:text-4xl font-bold mb-6 text-gray-800'>
						Rejoignez Notre Aventure
					</h2>
					<p className='text-lg text-gray-600 max-w-2xl mx-auto mb-8'>
						Nous évoluons et innovons constamment. Faites partie de notre
						communauté grandissante et découvrez l'avenir du shopping avec
						Tunimode.
					</p>
					<button
						onClick={() => (window.location.href = '/products')}
						className='bg-main-color-600 hover:bg-main-color-700 text-white px-8 py-3 rounded-full font-medium transition'
					>
						Explorer les produits
					</button>
				</section>
			</div>
		</>
	);
}
