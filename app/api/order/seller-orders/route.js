import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Address from '@/models/Address';
import Order from '@/models/Order';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const { userId } = getAuth(request);
		const isSeller = await authSeller(userId);
		if (!isSeller) {
			return NextResponse.json({
				success: false,
				message: 'You are not a seller',
			});
		}
		await connectDB();
		Address.length;

		const { searchParams } = new URL(request.url);
		const sortBy = searchParams.get('sortBy') || 'newest';

		let sortOptions = {};
		if (sortBy === 'newest') {
			sortOptions = { createdAt: -1 };
		} else if (sortBy === 'oldest') {
			sortOptions = { createdAt: 1 };
		} else if (sortBy === 'recentlyUpdated') {
			sortOptions = { updatedAt: -1 };
		}

		const orders = await Order.find({})
			.populate('address items.product')
			.sort(sortOptions);

		return NextResponse.json({
			success: true,
			orders,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			success: false,
			message: error.message,
		});
	}
}
