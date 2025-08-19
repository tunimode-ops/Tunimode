// pages/privacy-policy.jsx
import React from 'react';

const PrivacyPolicy = () => {
	return (
		<div className='max-w-3xl mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-4'>Politique de Confidentialité</h1>

			<p className='mb-4'>
				Nous accordons une grande importance à la protection de vos données
				personnelles. Cette Politique de Confidentialité explique quelles
				informations nous collectons, comment nous les utilisons et quels sont
				vos droits.
			</p>

			<h2 className='text-2xl font-semibold mb-2'>1. Données collectées</h2>
			<p className='mb-4'>
				Lorsque vous utilisez notre site, nous pouvons collecter :
			</p>
			<ul className='list-disc list-inside mb-4'>
				<li>
					Informations personnelles (nom, prénom, adresse, e-mail, numéro de
					téléphone)
				</li>
				<li>
					Informations liées à la livraison (adresse postale, instructions de
					livraison)
				</li>
				<li>Données de navigation (cookies, adresse IP, pages consultées)</li>
			</ul>

			<h2 className='text-2xl font-semibold mb-2'>
				2. Utilisation des données
			</h2>
			<ul className='list-disc list-inside mb-4'>
				<li>Traiter et expédier vos commandes</li>
				<li>Vous informer sur le suivi de vos achats</li>
				<li>Améliorer l’expérience utilisateur de notre site</li>
				<li>Vous envoyer, si vous l’acceptez, des offres promotionnelles</li>
			</ul>

			<h2 className='text-2xl font-semibold mb-2'>3. Partage des données</h2>
			<p className='mb-4'>
				Nous ne vendons ni ne louons vos données. Elles peuvent être partagées
				uniquement avec :
			</p>
			<ul className='list-disc list-inside mb-4'>
				<li>Nos transporteurs et partenaires logistiques</li>
				<li>Les autorités compétentes si la loi l’exige</li>
			</ul>

			<h2 className='text-2xl font-semibold mb-2'>4. Sécurité des données</h2>
			<p className='mb-4'>
				Nous mettons en œuvre des mesures techniques et organisationnelles pour
				protéger vos données contre toute perte, accès non autorisé ou
				divulgation.
			</p>

			<h2 className='text-2xl font-semibold mb-2'>5. Vos droits (RGPD)</h2>
			<ul className='list-disc list-inside mb-4'>
				<li>Accéder à vos données</li>
				<li>Rectifier vos données si elles sont inexactes</li>
				<li>Demander la suppression de vos données</li>
				<li>Vous opposer au traitement de vos données à des fins marketing</li>
			</ul>

			<h2 className='text-2xl font-semibold mb-2'>6. Cookies</h2>
			<p className='mb-4'>
				Notre site utilise des cookies afin d’améliorer votre navigation et de
				personnaliser votre expérience. Vous pouvez gérer vos préférences dans
				les paramètres de votre navigateur.
			</p>

			<h2 className='text-2xl font-semibold mb-2'>7. Contact</h2>
			<p>
				Pour toute question concernant cette Politique de Confidentialité, vous
				pouvez nous écrire à : <br />
				<a href='mailto:tunimode@gmail.com' className='text-blue-600'>
					tunimode@gmail.com
				</a>
			</p>
			<p className='mt-4 text-sm text-gray-500'>
				Site développé par{' '}
				<a
					href='https://www.linkedin.com/in/ghorbel-adem-324659219/'
					target='_blank'
					rel='noopener noreferrer'
					className='text-gray-500 underline hover:text-gray-700 transition'
				>
					<strong>Ghorbel Adem</strong>
				</a>
			</p>
		</div>
	);
};

export default PrivacyPolicy;
