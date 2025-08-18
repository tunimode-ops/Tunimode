import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Order from '@/models/Order';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
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

		const { orderId } = await request.json();

		if (!orderId) {
			return NextResponse.json(
				{
					success: false,
					message: 'Order ID is required',
				},
				{ status: 400 }
			);
		}

		await connectDB();

		const deletedOrder = await Order.findByIdAndDelete(orderId);

		if (!deletedOrder) {
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
			message: 'Order deleted successfully',
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
