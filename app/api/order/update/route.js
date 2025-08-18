import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Order from '@/models/Order';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PUT(request) {
	try {
		const { userId } = getAuth(request);
		const isSeller = await authSeller(userId);
		if (!isSeller) {
			return NextResponse.json(
				{
					success: false,
					message: 'You are not authorized',
				},
				{ status: 401 }
			);
		}

		const { orderId, state } = await request.json();

		if (!orderId || !state) {
			return NextResponse.json(
				{
					success: false,
					message: 'Order ID and state are required',
				},
				{ status: 400 }
			);
		}

		await connectDB();

		const updatedOrder = await Order.findByIdAndUpdate(
			orderId,
			{ state: state },
			{ new: true }
		);

		if (!updatedOrder) {
			return NextResponse.json(
				{
					success: false,
					message: 'Order not found',
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Order state updated successfully',
			order: updatedOrder,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{
				success: false,
				message: error.message,
			},
			{ status: 500 }
		);
	}
}
