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
					message: "Vous n'êtes pas autorisé à effectuer cette action.",
				},
				{ status: 401 }
			);
		}

		const { orderId, state } = await request.json();

		if (!orderId || !state) {
			return NextResponse.json(
				{
					success: false,
					message: "L'ID de la commande et l'état sont requis.",
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
					message: 'Commande introuvable.',
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: 'État de la commande mis à jour avec succès.',
			order: updatedOrder,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{
				success: false,
				message:
					"Une erreur est survenue lors de la mise à jour de l'état de la commande. Veuillez réessayer.",
			},
			{ status: 500 }
		);
	}
}
