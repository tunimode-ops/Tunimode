import connectDB from '@/config/db';
import Address from '@/models/Address';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const { userId } = getAuth(request);

		if (!userId) {
			return NextResponse.json(
				{
					success: false,
					message: 'Vous devez être connecté pour voir vos commandes.',
				},
				{ status: 401 }
			);
		}

		await connectDB();
		Address.length;
		Product.length;
		const orders = await Order.find({ userId }).populate(
			'address items.product'
		);
		const cleanedOrders = orders.map(order => {
			order.items = order.items.filter(item => item.product !== null);
			return order;
		});
		console.log('Fetched orders:', cleanedOrders);

		return NextResponse.json({
			success: true,
			orders: cleanedOrders,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			success: false,
			message:
				'Une erreur est survenue lors de la récupération de vos commandes. Veuillez réessayer.',
		});
	}
}
