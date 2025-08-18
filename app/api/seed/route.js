import connectDB from '@/config/db';
import Product from '@/models/Product';

const images = [
	{
		url: 'https://res.cloudinary.com/dqs53yu4o/image/upload/v1755443614/chic-robe-femme-soiree-cocktail-sur-l-epaule-asyme_cmbicy.jpg',
		public_id: 'robe1',
	},
	{
		url: 'https://res.cloudinary.com/dqs53yu4o/image/upload/v1755443614/71a-0tfK5PL._SL1500__t5jiil.jpg',
		public_id: 'green-shirt1',
	},
	{
		url: 'https://res.cloudinary.com/dqs53yu4o/image/upload/v1755443614/royalblue_6e043e24-752d-44f8-843e-e55dd33507b8_vcpieg.jpg',
		public_id: 'blue-tshirt1',
	},
	{
		url: 'https://res.cloudinary.com/dqs53yu4o/image/upload/v1755443613/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTEyL3M4MC1wYWktMTYyMC1qb2IxNDIxXzEtbGI2M3pqcjUuanBn_kyylbx.jpg',
		public_id: 'green-tshirt1',
	},
];

const categories = [
	['Clothing', 'T-Shirts'],
	['Clothing', 'Casual'],
	['Clothing', 'Formal'],
	['Clothing', 'Dresses'],
];

const sizes = ['S', 'M', 'L', 'XL'];
const fits = ['Slim', 'Regular', 'Oversized'];
const necklines = ['Round', 'V-Neck', 'Collared'];

function randomElement(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function generateProducts(count = 100) {
	return Array.from({ length: count }, (_, i) => {
		const img = randomElement(images);
		return {
			userId: `user${Math.floor(Math.random() * 10) + 1}`,
			name: `Product ${i + 1}`,
			price: Math.floor(Math.random() * 50) + 10,
			offerPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 40) + 5 : 0,
			description: `This is a stylish and comfortable ${randomElement([
				't-shirt',
				'dress',
				'shirt',
			])} perfect for all occasions.`,
			image: [img],
			categories: randomElement(categories),
			shop: Math.random() > 0.5 ? 'Prêt à Porter' : 'Fripe',
			quantity: Math.floor(Math.random() * 100) + 1, // Added quantity
			test: 'test',
			options: [
				{ name: 'Size', values: sizes },
				{ name: 'Fit', values: fits },
				{ name: 'Neckline', values: necklines },
			],
			date: Date.now(),
		};
	});
}

export async function GET() {
	try {
		await connectDB();

		const products = generateProducts(100);
		await Product.insertMany(products);

		return Response.json({
			success: true,
			message: '✅ Seeded 100 products successfully',
		});
	} catch (err) {
		return Response.json(
			{ success: false, error: err.message },
			{ status: 500 }
		);
	}
}
