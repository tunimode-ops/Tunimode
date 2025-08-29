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
					message: "Vous n'êtes pas autorisé à effectuer cette action.",
				},
				{ status: 401 }
			);
		}

		const { orderId } = await request.json();

		if (!orderId) {
			return NextResponse.json(
				{
					success: false,
					message: "L'ID de la commande est requis.",
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
					message: 'Commande introuvable.',
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Commande supprimée avec succès.',
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{
				success: false,
				message:
					'Une erreur est survenue lors de la suppression de la commande. Veuillez réessayer.',
			},
			{ status: 500 }
		);
	}
}
