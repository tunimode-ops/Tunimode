import React from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';

const Footer = () => {
	return (
		<footer className='bg-gray-50 border-t border-gray-200 mt-12'>
			<div className='px-6 md:px-16 lg:px-32 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-600'>
				{/* Brand Info */}
				<div>
					<Image className='w-32 mb-6' src={assets.logo} alt='Logo Tunimode' />
					<p className='text-sm leading-6'>
						Tunimode est votre destination pour la mode tendance en Tunisie.
						Découvrez les dernières collections pour hommes, femmes et enfants –
						qualité et style aux meilleurs prix.
					</p>
					<div className='flex gap-4 mt-6'>
						<a
							href='https://www.instagram.com/tunimode/'
							aria-label='Instagram'
							className='p-2 bg-gray-200 rounded-full hover:bg-main-color-600 hover:text-white transition'
						>
							<FaInstagram size={16} />
						</a>
						<a
							href='https://www.facebook.com/people/TuniMode/61579307951186/'
							aria-label='Facebook'
							className='p-2 bg-gray-200 rounded-full hover:bg-main-color-600 hover:text-white transition'
						>
							<FaFacebookF size={16} />
						</a>
					</div>
				</div>

				{/* Links */}
				<div>
					<h2 className='font-semibold text-gray-900 mb-5'>Liens rapides</h2>
					<ul className='text-sm space-y-3'>
						<li>
							<a className='hover:text-main-color-600 transition' href='/'>
								Accueil
							</a>
						</li>
						<li>
							<a className='hover:text-main-color-600 transition' href='/about'>
								À propos de nous
							</a>
						</li>
						<li>
							<a
								className='hover:text-main-color-600 transition'
								href='/all-products'
							>
								Boutique
							</a>
						</li>
						<li>
							<a
								className='hover:text-main-color-600 transition'
								href='/contact'
							>
								Contact
							</a>
						</li>
						<li>
							<a
								className='hover:text-main-color-600 transition'
								href='/privacy-policy'
							>
								Politique de confidentialité
							</a>
						</li>
					</ul>
				</div>

				{/* Contact */}
				<div>
					<h2 className='font-semibold text-gray-900 mb-5'>Contactez-nous</h2>
					<ul className='text-sm space-y-3'>
						<li>📍 Sfax, Tunisie</li>
						<li>📧 tunimode@gmail.com</li>
					</ul>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className='border-t border-gray-200 py-4 text-center text-xs md:text-sm text-gray-500'>
				© {new Date().getFullYear()} Tunimode. Tous droits réservés.
			</div>
		</footer>
	);
};

export default Footer;
