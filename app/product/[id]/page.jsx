'use client';
import { useEffect, useState } from 'react';
import { assets } from '@/assets/assets';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import { useAppContext } from '@/context/AppContext';

const Product = () => {
	const { id } = useParams();
	const { currency, products, router, addToCart } = useAppContext();

	const [mainImage, setMainImage] = useState(null);
	const [productData, setProductData] = useState(null);
	const [selectedOptions, setSelectedOptions] = useState({});
	const [loading, setLoading] = useState(false); // <-- main product buttons loading

	const fetchProductData = async () => {
		const product = products.find(product => product._id === id);
		setProductData(product);

		if (product?.options?.length > 0) {
			const initialOptions = {};
			product.options.forEach(option => {
				if (option.values?.length > 0) {
					initialOptions[option.name] = option.values[0];
				}
			});
			setSelectedOptions(initialOptions);
		} else {
			setSelectedOptions({});
		}
	};

	useEffect(() => {
		fetchProductData();
	}, [id, products.length]);

	const handleOptionChange = (optionName, value) => {
		setSelectedOptions(prev => ({
			...prev,
			[optionName]: value,
		}));
	};

	const handleAddToCart = async () => {
		if (productData.quantity === 0 || loading) return;
		setLoading(true);
		try {
			await addToCart(productData._id, selectedOptions);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleBuyNow = async () => {
		if (productData.quantity === 0 || loading) return;
		setLoading(true);
		try {
			await addToCart(productData._id, selectedOptions);
			router.push('/cart');
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	if (!productData) return <Loading />;

	const featuredProducts = products
		.filter(p => p._id !== productData._id && p.shop === productData.shop)
		.slice(0, 5);

	return (
		<>
			<Navbar />
			<div className='px-6 md:px-16 lg:px-32 pt-14 space-y-16'>
				{/* Product Main Section */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start'>
					{/* Left: Images */}
					<div className='space-y-4'>
						<div className='rounded-lg overflow-hidden bg-gray-100'>
							<Image
								src={
									mainImage || productData.image[0].url || assets.placeholder
								}
								alt={productData.name}
								className='w-full h-[400px] md:h-[500px] object-contain rounded-lg'
								width={1280}
								height={720}
							/>
						</div>
						<div className='grid grid-cols-4 gap-3'>
							{productData.image.map((img, idx) => (
								<div
									key={idx}
									onClick={() => setMainImage(img.url)}
									className='cursor-pointer rounded-lg overflow-hidden bg-gray-100 hover:scale-105 transition-transform'
								>
									<Image
										src={img.url || assets.placeholder}
										alt={`${productData.name} ${idx + 1}`}
										className='w-full h-[90px] md:h-[110px] object-contain rounded-lg'
										width={1280}
										height={720}
									/>
								</div>
							))}
						</div>
					</div>

					{/* Right: Details */}
					<div className='flex flex-col justify-start gap-4'>
						<div>
							<h1 className='text-3xl md:text-4xl font-semibold text-gray-800'>
								{productData.name}
							</h1>
							<p className='text-gray-500 text-sm md:text-base'>
								Vendu par{' '}
								<span className='font-medium text-main-color-600'>
									{productData.shop}
								</span>
							</p>
							<p className='text-gray-700 mt-2 md:mt-3 max-h-32 overflow-auto'>
								{productData.description}
							</p>

							{/* Categories */}
							<div className='flex flex-wrap gap-2 mt-3'>
								{productData.categories.map(cat => (
									<span
										key={cat}
										className='px-3 py-1 bg-main-color-50 text-main-color-600 text-xs md:text-sm rounded-full border border-main-color-100'
									>
										{cat}
									</span>
								))}
							</div>

							{/* Price */}
							<p className='text-2xl md:text-3xl font-semibold mt-4'>
								{productData.offerPrice < productData.price &&
								productData.offerPrice > 0
									? productData.offerPrice
									: productData.price}
								<small className='text-sm text-gray-500 ml-1'>
									<b className='text-main-color-900'>{currency}</b>
								</small>
								{productData.offerPrice < productData.price &&
									productData.offerPrice > 0 && (
										<span className='line-through text-gray-400 text-lg md:text-xl ml-2'>
											{productData.price}
											<small className='text-sm no-underline text-gray-400 ml-1'>
												{currency}
											</small>
										</span>
									)}
							</p>

							{/* Options */}
							{productData.options?.length > 0 && (
								<div className='mt-4 space-y-3'>
									{productData.options.map(option => (
										<div key={option.name}>
											<label className='block text-gray-700 font-medium mb-1'>
												{option.name}:
											</label>
											<select
												value={selectedOptions[option.name] || ''}
												onChange={e =>
													handleOptionChange(option.name, e.target.value)
												}
												className='block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-main-color-500 focus:border-main-color-500'
											>
												{option.values.map(value => (
													<option key={value} value={value}>
														{value}
													</option>
												))}
											</select>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Action Buttons */}
						<div className='flex flex-col md:flex-row gap-3 mt-6 sticky md:static bottom-4 md:bottom-auto bg-white md:bg-transparent p-4 md:p-0'>
							<button
								onClick={handleAddToCart}
								disabled={productData.quantity === 0 || loading}
								className={`w-full md:w-1/2 py-3.5 transition rounded-md ${
									productData.quantity === 0 || loading
										? 'bg-gray-200 text-gray-500 cursor-not-allowed'
										: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
								}`}
							>
								{loading
									? 'Ajout en cours...'
									: productData.quantity === 0
									? 'En rupture de stock'
									: 'Ajouter au panier'}
							</button>
							<button
								onClick={handleBuyNow}
								disabled={productData.quantity === 0 || loading}
								className={`w-full md:w-1/2 py-3.5 transition rounded-md ${
									productData.quantity === 0 || loading
										? 'bg-gray-200 text-gray-500 cursor-not-allowed'
										: 'bg-main-color-500 text-white hover:bg-main-color-600'
								}`}
							>
								{loading ? 'Traitement...' : 'Acheter maintenant'}
							</button>
						</div>
					</div>
				</div>

				{/* Featured Products */}
				<div className='mt-16'>
					<div className='flex flex-col items-center mb-6'>
						<p className='text-3xl font-medium text-gray-800'>
							Produits phares de{' '}
							<span className='text-main-color-600'>{productData.shop}</span>
						</p>
						<div className='w-28 h-0.5 bg-main-color-600 mt-2'></div>
					</div>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
						{featuredProducts.length > 0 ? (
							featuredProducts.map((product, idx) => (
								<ProductCard key={idx} product={product} />
							))
						) : (
							<p className='text-gray-500 col-span-full text-center'>
								Aucun autre produit de cette boutique.
							</p>
						)}
					</div>
				</div>

				{/* Recommended Products */}
				{products.length > 0 && (
					<div className='mt-16'>
						<div className='flex flex-col items-center mb-6'>
							<p className='text-2xl font-medium text-gray-800'>
								Vous pourriez aussi aimer
							</p>
							<div className='w-24 h-0.5 bg-main-color-600 mt-2'></div>
						</div>
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
							{products
								.filter(p => p._id !== productData._id)
								.slice(0, 5)
								.map((product, idx) => (
									<ProductCard key={idx} product={product} />
								))}
						</div>
					</div>
				)}
			</div>
			<Footer />
		</>
	);
};

export default Product;
