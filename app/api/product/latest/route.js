import connectDB from '@/config/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);

		// Query params
		const limit = parseInt(searchParams.get('limit')) || 3;
		const category = searchParams.get('category') || null;
		const search = searchParams.get('search') || '';
		const shop = searchParams.get('shop') || null;
		const sortOrder = searchParams.get('sort') === 'oldest' ? 1 : -1;

		// Build query
		const query = { image: { $ne: [] } };

		if (category) {
			query.categories = category; // single category filter
		}

		if (shop) {
			query.shop = shop; // filter by shop
		}

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } },
			];
		}

		const products = await Product.find(query)
			.sort({ createdAt: sortOrder })
			.limit(limit);

		return NextResponse.json({ success: true, products });
	} catch (error) {
		console.error(error);
		return NextResponse.json({
			success: false,
			message: error.message,
			products: [],
		});
	}
}
