import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
	try {
		const { userId } = getAuth(request);
		const isSeller = await authSeller(userId);
		if (!isSeller) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Vous n'êtes pas autorisé à ajouter un produit (non-vendeur).",
				},
				{ status: 403 }
			);
		}

		const formData = await request.formData();

		const name = formData.get('name');
		const description = formData.get('description');
		const selectedCategories = JSON.parse(
			formData.get('selectedCategories') || '[]'
		);
		const newCategories = formData.get('newCategories') || '';

		const combinedCategories = [
			...selectedCategories,
			...newCategories.split(',').map(c => c.trim()),
		];

		const categories = [
			...new Set(
				combinedCategories.map(c => c.toLowerCase().trim()).filter(c => c)
			),
		];
		const price = formData.get('price');
		const offerPrice = formData.get('offerPrice');
		const shop = formData.get('shop');
		const quantity = formData.get('quantity'); // Get quantity data
		const options = formData.get('options'); // Get options data
		const parsedOptions = options ? JSON.parse(options) : [];
		const files = formData.getAll('images');

		if (!files || files.length === 0) {
			return NextResponse.json({
				success: false,
				message:
					'Aucune image téléchargée. Veuillez ajouter au moins une image.',
			});
		}

		const result = await Promise.all(
			files.map(async file => {
				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);

				return new Promise((resolve, reject) => {
					const stream = cloudinary.uploader.upload_stream(
						{ resource_type: 'auto' },
						(error, result) => {
							if (error) {
								reject(error);
							} else {
								resolve(result);
							}
						}
					);

					stream.end(buffer);
				});
			})
		);

		const images = result.map(file => ({
			url: file.secure_url,
			public_id: file.public_id,
		}));

		await connectDB();

		const newProduct = await Product.create({
			userId,
			name,
			description,
			price: Number(price),
			offerPrice:
				Number(offerPrice) > 0 && Number(offerPrice) < Number(price)
					? Number(offerPrice)
					: Number(price),
			categories,
			image: images,
			shop,
			options: parsedOptions,
			date: Date.now(),
			quantity: Number(quantity),
		});

		return NextResponse.json({
			success: true,
			message: 'Produit ajouté avec succès.',
			newProduct,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			success: false,
			message:
				"Une erreur est survenue lors de l'ajout du produit. Veuillez réessayer.",
		});
	}
}
