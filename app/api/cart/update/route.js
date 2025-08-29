import connectDB from '@/config/db';
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
	try {
		const { userId } = getAuth(request);

		if (!userId) {
			return NextResponse.json(
				{
					success: false,
					message: 'Vous devez être connecté pour mettre à jour votre panier.',
				},
				{ status: 401 }
			);
		}

		const { cartData } = await request.json();
		await connectDB();

		const user = await User.findById(userId);
		user.cartItems = cartData;
		await user.save();
		return NextResponse.json({
			success: true,
			message: 'Panier mis à jour avec succès',
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			success: false,
			message:
				'Une erreur est survenue lors de la mise à jour du panier. Veuillez réessayer.',
		});
	}
}
