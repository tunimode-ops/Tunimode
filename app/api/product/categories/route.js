import { NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import Product from '@/models/Product';

export const GET = async req => {
	try {
		await dbConnect();
		const categories = await Product.distinct('categories');
		const normalizedCategories = categories
			.map(cat => cat.trim())
			.filter(cat => cat);
		const uniqueCategories = [...new Set(normalizedCategories)];
		return NextResponse.json({ categories: uniqueCategories });
	} catch (error) {
		console.error('Error fetching categories:', error);
		return NextResponse.json(
			{
				error:
					'Une erreur est survenue lors de la récupération des catégories.',
			},
			{ status: 500 }
		);
	}
};
