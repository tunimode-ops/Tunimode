'use client';
import React from 'react';
import HeaderSlider from '@/components/HeaderSlider';
import HomeProducts from '@/components/HomeProducts';
import FeaturedProduct from '@/components/FeaturedProduct';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';

const Home = () => {
	return (
		<>
			<Navbar />
			<div className='px-6 md:px-16 lg:px-32'>
				<HeaderSlider />
				<HomeProducts />
				<FeaturedProduct />
			</div>
			<Footer />
		</>
	);
};

export default Home;
