import connectDB from '@/config/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		await connectDB();

		const products = await Product.find({
			image: { $exists: true, $ne: [] }, // images array exists and is not empty
		});

		return NextResponse.json({ success: true, products });
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			success: false,
			message:
				'Une erreur est survenue lors de la récupération des produits. Veuillez réessayer.',
		});
	}
}
