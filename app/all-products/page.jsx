// app/all-products/page.jsx (Server Component)

import { Suspense } from 'react';
import ProductsList from './ProductsList';
import { Loader } from 'lucide-react';

export default function Page() {
	return (
		<div>
			<Suspense
				fallback={
					<div>
						<Loader color='main-color' />
					</div>
				}
			>
				<ProductsList />
			</Suspense>
		</div>
	);
}
