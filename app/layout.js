import { Outfit } from 'next/font/google';
import './globals.css';
import { AppContextProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs';
import MainLayout from '@/components/MainLayout';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500'] });

export const metadata = {
	title: 'Tunimode - Boutique de Mode en Ligne',
	description:
		'Découvrez les dernières tendances de mode sur Tunimode. Livraison rapide partout en Tunisie.',
	keywords:
		'Tunimode, mode, vêtements, accessoires, boutique en ligne, shopping, tendances, livraison rapide, paiements sécurisés, offres exclusives, Tunisie, fashion, e-commerce',
	author: 'Tunimode Team',
	robots: 'index, follow',
	openGraph: {
		title: 'Tunimode - Boutique de Mode en Ligne',
		description:
			'Découvrez les dernières tendances de mode sur Tunimode. Livraison rapide partout en Tunisie.',
		url: 'https://tunimode.com',
		siteName: 'Tunimode',
		images: [
			{
				url: 'https://tunimode.com/tunimode.webp',
				width: 800,
				height: 600,
				alt: 'Tunimode Fashion',
			},
		],
		locale: 'fr_FR',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Tunimode - Boutique de Mode en Ligne',
		description:
			'Découvrez les dernières tendances de mode sur Tunimode. Livraison rapide partout en Tunisie.',
		images: ['https://tunimode.com/tunimode.webp'],
	},
};

export default function RootLayout({ children }) {
	return (
		<ClerkProvider>
			<html lang='fr'>
				<body className={`${outfit.className} antialiased text-gray-700`}>
					<Toaster />
					<AppContextProvider>
						<>{children}</>
					</AppContextProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
