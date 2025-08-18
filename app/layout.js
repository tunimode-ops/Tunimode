import { Outfit } from 'next/font/google';
import './globals.css';
import { AppContextProvider } from '@/context/AppContext';
import { Toaster } from 'react-hot-toast';
import { ClerkProvider } from '@clerk/nextjs';
import MainLayout from '@/components/MainLayout';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500'] });

export const metadata = {
	title: 'Tunimode - Online Fashion Store',
	description:
		'Discover the latest trends in fashion, clothing, and accessories at Tunimode. Shop online with fast shipping, secure payments, and exclusive deals.',
};

export default function RootLayout({ children }) {
	return (
		<ClerkProvider>
			<html lang='en'>
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
