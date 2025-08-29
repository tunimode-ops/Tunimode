import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const { userId } = getAuth(request);
		const isSeller = await authSeller(userId);
		if (!isSeller) {
			return NextResponse.json(
				{
					success: false,
					message: "Non autorisé. Vous n'êtes pas un vendeur.",
				},
				{ status: 403 }
			);
		}

		await connectDB();

		const { searchParams } = new URL(request.url);
		const search = searchParams.get('search') || '';
		const category = searchParams.get('category') || '';
		const shop = searchParams.get('shop') || '';
		const sort = searchParams.get('sort') || 'newest';
		const page = parseInt(searchParams.get('page') || '1');
		const limit = parseInt(searchParams.get('limit') || '10');

		const query = { image: { $exists: true, $ne: [] } };

		if (category) query.categories = category;
		if (shop && shop !== 'All') query.shop = shop;
		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
			];
		}

		// Get total count
		const totalProducts = await Product.countDocuments(query);

		// Apply sorting
		let sortOption = {};
		if (sort === 'newest') sortOption = { date: -1 };
		else if (sort === 'oldest') sortOption = { date: 1 };
		else if (sort === 'lowprice') sortOption = { offerPrice: 1 };
		else if (sort === 'highprice') sortOption = { offerPrice: -1 };

		const products = await Product.find(query)
			.sort(sortOption)
			.skip((page - 1) * limit)
			.limit(limit);

		const totalPages = Math.ceil(totalProducts / limit);

		return NextResponse.json({
			success: true,
			products,
			totalProducts,
			totalPages,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			success: false,
			message:
				'Une erreur est survenue lors de la récupération de la liste des produits du vendeur. Veuillez réessayer.',
		});
	}
}
