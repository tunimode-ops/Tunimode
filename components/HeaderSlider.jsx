import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import { useAppContext } from '@/context/AppContext';
import { assets } from '@/assets/assets';

export default function HeaderSlider() {
	const { products, router } = useAppContext();

	const sliderProducts = products.slice(0, 5);

	if (!sliderProducts.length) {
		return (
			<div className='w-full h-[60vh] flex flex-col items-center justify-center text-gray-400 gap-4'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-16 w-16'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
					/>
				</svg>
				<p className='text-lg'>Aucun produit disponible</p>
				<button
					onClick={() => router.refresh()}
					className='mt-4 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition'
				>
					Actualiser
				</button>
			</div>
		);
	}

	return (
		<div className='w-full max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-6'>
			<Swiper
				modules={[Autoplay, Pagination]}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
					pauseOnMouseEnter: true,
				}}
				pagination={{
					clickable: true,
					bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-100',
					bulletActiveClass:
						'swiper-pagination-bullet-active !bg-white !w-8 !rounded',
				}}
				loop
				speed={800}
				className='rounded-2xl md:rounded-3xl overflow-hidden shadow-xl'
			>
				{sliderProducts.map(product => (
					<SwiperSlide key={product._id}>
						<div className='relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh]'>
							{/* Background Image */}
							<div className='absolute inset-0'>
								<Image
									src={product?.image?.[0]?.url || assets.placeholder}
									alt={product.name}
									fill
									priority
									quality={100}
									sizes='(max-width: 768px) 100vw, 1200px'
									className='object-cover transition-all duration-1000 ease-out group-hover:scale-105'
								/>
								{/* Gradient Overlay */}
								<div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent' />
							</div>

							{/* Content */}
							<div className='relative z-10 flex flex-col justify-end h-full pb-12 md:pb-16 lg:pb-20 px-6 md:px-10 lg:px-16 text-left'>
								<div className='max-w-2xl'>
									{/* Category Tag */}
									{product.category && (
										<span className='inline-block px-3 py-1 mb-3 text-xs font-semibold text-white bg-black/30 backdrop-blur-sm rounded-full border border-white/20'>
											{product.category}
										</span>
									)}

									<h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white drop-shadow-xl'>
										{product.name}
									</h2>

									<p className='text-sm sm:text-base md:text-lg mb-6 text-white/90 max-w-lg'>
										{product.description?.slice(0, 140) ||
											'Découvrez notre produit premium'}
										{product.description?.length > 140 && '...'}
									</p>

									<div className='flex flex-col sm:flex-row gap-4'>
										<button
											onClick={() => router.push(`/product/${product._id}`)}
											className='px-6 py-3 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-gray-100 transition flex items-center justify-center gap-2'
										>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-5 w-5'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
												/>
											</svg>
											Acheter maintenant
										</button>

										{product.price && (
											<div className='bg-black/30 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20 text-white font-bold text-lg flex items-center'>
												{product.price.toFixed(2)}
												<small className='text-sm text-gray-500 ml-1'>
													<b className='text-white'>TND</b>
												</small>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Floating Rating */}
							{product.rating && (
								<div className='absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1 z-20 shadow-md'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-5 w-5 text-yellow-500'
										viewBox='0 0 20 20'
										fill='currentColor'
									>
										<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
									</svg>
									<span className='font-bold'>{product.rating}</span>
									<span className='text-gray-600'>/5</span>
								</div>
							)}
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
