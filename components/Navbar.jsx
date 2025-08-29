'use client';
import React from 'react';
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from '@/assets/assets';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useClerk, UserButton } from '@clerk/nextjs';

const Navbar = () => {
	const { isSeller, router, user, getCartCount } = useAppContext();
	const { openSignIn } = useClerk();

	return (
		<nav className='sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200'>
			<div className='flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 text-gray-700'>
				{/* Logo */}
				<Image
					className='cursor-pointer w-28 md:w-32 text-main-color-600 fill-current'
					onClick={() => router.push('/')}
					src={assets.logo}
					alt='Tunimode logo'
				/>

				{/* Desktop Menu */}
				<div className='hidden md:flex items-center gap-6 lg:gap-10'>
					<Link href='/' className='hover:text-main-color-600 transition'>
						Accueil
					</Link>
					<Link
						href='/all-products'
						className='hover:text-main-color-600 transition'
					>
						Boutique
					</Link>
					<Link
						href='/all-products?shop=Nouveau'
						className='hover:text-main-color-600 transition'
					>
						Nouveau
					</Link>
					<Link
						href='/all-products?shop=Fripe'
						className='hover:text-main-color-600 transition'
					>
						Fripe
					</Link>
					<Link href='/about' className='hover:text-main-color-600 transition'>
						À propos de nous
					</Link>
					<Link
						href='/contact'
						className='hover:text-main-color-600 transition'
					>
						Contact
					</Link>

					{/* Orders (always visible) */}
					<Link
						href='/my-orders'
						className='hover:text-main-color-600 transition'
					>
						Commandes
					</Link>

					{Boolean(user) && isSeller && (
						<button
							onClick={() => router.push('/seller')}
							className='text-xs border px-4 py-1.5 rounded-full hover:bg-main-color-600 hover:text-white transition'
						>
							Tableau de bord Vendeur
						</button>
					)}
				</div>

				{/* Right Section */}
				<div className='flex items-center gap-4 md:gap-6'>
					{/* Cart */}
					{user && (
						<button onClick={() => router.push('/cart')} className='relative'>
							<CartIcon />
							{getCartCount() > 0 && (
								<span
									className='
										absolute -top-1 -right-1
										bg-main-color-700 text-white font-semibold text-xs
										w-4 h-4
										flex items-center justify-center
										rounded-full
										shadow
										transition-transform duration-150 ease-in-out
										hover:scale-110
									'
								>
									{getCartCount()}
								</span>
							)}
						</button>
					)}

					{/* User Account */}
					{user ? (
						<UserButton afterSignOutUrl='/' />
					) : (
						<button
							onClick={openSignIn}
							className='flex items-center gap-2 hover:text-main-color-600 transition'
						>
							<Image src={assets.user_icon} alt='user icon' />
							<span className='hidden md:inline'>Compte</span>
						</button>
					)}
				</div>
			</div>

			{/* Mobile Menu */}
			<div className='flex items-center justify-around md:hidden border-t border-gray-200 py-2 bg-white'>
				<button onClick={() => router.push('/')}>
					<HomeIcon />
				</button>
				<button onClick={() => router.push('/all-products')}>
					<BoxIcon />
				</button>
				<button onClick={() => router.push('/all-products?shop=Nouveau')}>
					<span className='text-sm font-medium'>Prêt</span>
				</button>
				<button onClick={() => router.push('/all-products?shop=Fripe')}>
					<span className='text-sm font-medium'>Fripe</span>
				</button>
				<button onClick={() => router.push('/cart')} className='relative'>
					<CartIcon />
					{getCartCount() > 0 && (
						<span className='absolute -top-1 -right-2 bg-main-color-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full'>
							{getCartCount()}
						</span>
					)}
				</button>
				{/* Orders always visible */}
				<button onClick={() => router.push('/my-orders')}>
					<BagIcon />
				</button>
				{user && isSeller && (
					<button
						onClick={() => router.push('/seller')}
						className='text-xs border px-3 py-1 rounded-full hover:bg-main-color-600 hover:text-white transition'
					>
						Vendeur
					</button>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
