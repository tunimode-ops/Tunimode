import React from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';

const Footer = () => {
	return (
		<footer className='bg-gray-50 border-t border-gray-200'>
			<div className='max-w-7xl mx-auto px-6 md:px-16 lg:px-32 py-12 flex flex-col md:flex-row justify-between gap-10'>
				{/* Logo & About */}
				<div className='flex-1'>
					<Image className='w-32 mb-4' src={assets.logo} alt='Tunimode logo' />
					<p className='text-gray-500 text-sm md:text-base max-w-xs'>
						Tunimode est votre boutique en ligne incontournable pour les
						dernières tendances de la mode. Nous proposons des produits de
						qualité provenant de vendeurs de confiance pour rendre votre
						expérience d'achat facile et agréable.
					</p>
				</div>

				{/* Company Links */}
				<div className='flex-1'>
					<h3 className='font-medium text-gray-900 mb-4'>Entreprise</h3>
					<ul className='text-gray-500 space-y-2 text-sm'>
						<li>
							<a href='/' className='hover:text-main-color-600 transition'>
								Accueil
							</a>
						</li>
						<li>
							<a href='/about' className='hover:text-main-color-600 transition'>
								À propos de nous
							</a>
						</li>
						<li>
							<a
								href='/contact'
								className='hover:text-main-color-600 transition'
							>
								Contactez-nous
							</a>
						</li>
						<li>
							<a
								href='/privacy'
								className='hover:text-main-color-600 transition'
							>
								Politique de confidentialité
							</a>
						</li>
					</ul>
				</div>

				{/* Contact */}
				<div className='flex-1'>
					<h3 className='font-medium text-gray-900 mb-4'>Contactez-nous</h3>
					<p className='text-gray-500 text-sm mb-2'>
						Téléphone: +1-234-567-890
					</p>
					<p className='text-gray-500 text-sm mb-4'>
						Email: contact@tunimode.com
					</p>
					<div className='flex gap-4'>
						<a href='#' className='hover:opacity-80 transition'>
							<Image
								src={assets.facebook_icon}
								alt='Facebook'
								width={24}
								height={24}
							/>
						</a>
						<a href='#' className='hover:opacity-80 transition'>
							<Image
								src={assets.twitter_icon}
								alt='Twitter'
								width={24}
								height={24}
							/>
						</a>
						<a href='#' className='hover:opacity-80 transition'>
							<Image
								src={assets.instagram_icon}
								alt='Instagram'
								width={24}
								height={24}
							/>
						</a>
					</div>
				</div>
			</div>

			<div className='border-t border-gray-200 mt-6 py-4 text-center text-gray-500 text-xs md:text-sm'>
				Copyright 2025 © Tunimode. Tous droits réservés.
			</div>
		</footer>
	);
};

export default Footer;
