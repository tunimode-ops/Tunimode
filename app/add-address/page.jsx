'use client';
import { assets } from '@/assets/assets';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddAddress = () => {
	const { getToken, router } = useAppContext();
	const [address, setAddress] = useState({
		fullName: '',
		phoneNumber: '',
		pincode: '',
		area: '',
		city: '',
		state: '',
	});

	const onSubmitHandler = async e => {
		e.preventDefault();
		try {
			const token = await getToken();
			const { data } = await axios.post(
				'/api/user/add-address',
				{ address },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (data.success) {
				toast.success(data.message);
				router.push('/cart');
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<>
			<Navbar />
			<div className='px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between'>
				<form onSubmit={onSubmitHandler} className='w-full'>
					<p className='text-2xl md:text-3xl text-gray-500'>
						Ajouter une{' '}
						<span className='font-semibold text-main-color-600'>
							Adresse de livraison
						</span>
					</p>
					<div className='space-y-3 max-w-sm mt-10'>
						<input
							className='px-2 py-2.5 focus:border-main-color-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500'
							type='text'
							placeholder='Nom complet'
							onChange={e =>
								setAddress({ ...address, fullName: e.target.value })
							}
							value={address.fullName}
						/>
						<input
							className='px-2 py-2.5 focus:border-main-color-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500'
							type='text'
							placeholder='Numéro de téléphone'
							onChange={e =>
								setAddress({ ...address, phoneNumber: e.target.value })
							}
							value={address.phoneNumber}
						/>
						<input
							className='px-2 py-2.5 focus:border-main-color-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500'
							type='text'
							placeholder='Code postal'
							onChange={e =>
								setAddress({ ...address, pincode: e.target.value })
							}
							value={address.pincode}
						/>
						<textarea
							className='px-2 py-2.5 focus:border-main-color-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none'
							type='text'
							rows={4}
							placeholder='Adresse (Zone et Rue)'
							onChange={e => setAddress({ ...address, area: e.target.value })}
							value={address.area}
						></textarea>
						<div className='flex space-x-3'>
							<input
								className='px-2 py-2.5 focus:border-main-color-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500'
								type='text'
								placeholder='Ville/District/Commune'
								onChange={e => setAddress({ ...address, city: e.target.value })}
								value={address.city}
							/>
							<input
								className='px-2 py-2.5 focus:border-main-color-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500'
								type='text'
								placeholder='État'
								onChange={e =>
									setAddress({ ...address, state: e.target.value })
								}
								value={address.state}
							/>
						</div>
					</div>
					<button
						type='submit'
						className='max-w-sm w-full mt-6 bg-main-color-600 text-white py-3 hover:bg-main-color-700 uppercase'
					>
						Enregistrer l'adresse
					</button>
				</form>
				<Image
					className='md:mr-16 mt-16 md:mt-0'
					src={assets.my_location_image}
					alt='my_location_image'
				/>
			</div>
			<Footer />
		</>
	);
};

export default AddAddress;
