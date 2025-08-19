'use client';
import React, { useState } from 'react';
import { FaEnvelope, FaFacebookF, FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import emailjs from 'emailjs-com';

const ContactPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [loading, setLoading] = useState(false);

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);

		try {
			await emailjs.send(
				'service_8wof16i', // Remplace par ton Service ID EmailJS
				'template_3eflku8', // Remplace par ton Template ID EmailJS
				{
					name: formData.name,
					email: formData.email,
					subject: formData.subject,
					message: formData.message,
				},
				'yWpbuDTAtjZannpid' // Remplace par ton Public Key EmailJS
			);

			toast.success('Message envoyé avec succès !');
			setFormData({ name: '', email: '', subject: '', message: '' });
		} catch (err) {
			console.error(err);
			toast.error('Échec de l’envoi du message.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Navbar />
			<div className='min-h-screen bg-gray-50 flex flex-col'>
				<div className='flex-1 flex flex-col lg:flex-row items-start lg:items-center justify-center p-6 lg:p-16 gap-10'>
					{/* Contact Info */}
					<div className='w-full lg:w-1/3 bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-6'>
						<h2 className='text-3xl font-bold text-gray-800'>Contactez-nous</h2>
						<p className='text-gray-600'>
							Pour toute question, support ou demande commerciale.
						</p>

						<div className='flex items-center gap-3 text-gray-700'>
							<FaEnvelope className='text-main-color-600 w-5 h-5' />
							<span>tunimode@gmail.com</span>
						</div>

						<div className='flex gap-4 mt-4'>
							<a
								href='https://www.facebook.com/people/TuniMode/61579307951186/'
								className='p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition'
							>
								<FaFacebookF />
							</a>
							<a
								href='https://www.instagram.com/tunimode/'
								className='p-2 rounded-full bg-pink-400 text-white hover:bg-sky-500 transition'
							>
								<FaInstagram />
							</a>
						</div>
					</div>

					{/* Contact Form */}
					<div className='w-full lg:w-2/3 bg-white p-8 rounded-2xl shadow-xl'>
						<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
							<div className='flex flex-col md:flex-row gap-4'>
								<input
									type='text'
									name='name'
									placeholder='Votre Nom'
									value={formData.name}
									onChange={handleChange}
									required
									className='border border-gray-300 rounded px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-main-color-500 transition'
								/>
								<input
									type='email'
									name='email'
									placeholder='Votre Email'
									value={formData.email}
									onChange={handleChange}
									required
									className='border border-gray-300 rounded px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-main-color-500 transition'
								/>
							</div>
							<input
								type='text'
								name='subject'
								placeholder='Sujet'
								value={formData.subject}
								onChange={handleChange}
								required
								className='border border-gray-300 rounded px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-main-color-500 transition'
							/>
							<textarea
								name='message'
								placeholder='Votre Message'
								value={formData.message}
								onChange={handleChange}
								required
								rows={6}
								className='border border-gray-300 rounded px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-main-color-500 transition resize-none'
							></textarea>
							<button
								type='submit'
								disabled={loading}
								className='bg-main-color-600 text-white px-6 py-3 rounded-xl hover:bg-main-color-700 transition'
							>
								{loading ? 'Envoi...' : 'Envoyer le message'}
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ContactPage;
