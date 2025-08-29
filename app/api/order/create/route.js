import connectDB from '@/config/db';
import { inngest } from '@/config/inngest';
import Product from '@/models/Product';
import User from '@/models/User';
import { getAuth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(request) {
	try {
		const { userId } = getAuth(request);

		if (!userId) {
			return NextResponse.json(
				{
					success: false,
					message: 'Vous devez créer un compte pour passer une commande.',
				},
				{ status: 401 }
			);
		}

		const { address, items } = await request.json();

		if (!address || items.length === 0) {
			return NextResponse.json({
				success: false,
				message:
					'Données invalides. Veuillez fournir une adresse et des articles.',
			});
		}

		await connectDB();
		let amount = Number(process.env.NEXT_PUBLIC_SHIPPING_COST) || 0;
		const productsToUpdate = [];

		for (const item of items) {
			if (!mongoose.Types.ObjectId.isValid(item.product)) {
				console.log('Invalid product ID:', item.product);
				continue;
			}
			const product = await Product.findById(item.product);

			if (!product) {
				console.log('Product not found:', item.product);
				continue;
			}

			if (!product || product.quantity < item.quantity) {
				return NextResponse.json(
					{
						success: false,
						message: `Stock insuffisant pour ${
							product?.name || 'un produit'
						}. Disponible: ${product?.quantity || 0}, Demandé: ${
							item.quantity
						}.`,
					},
					{ status: 400 }
				);
			}

			amount += product.offerPrice * item.quantity;
			productsToUpdate.push({
				productId: product._id,
				newQuantity: product.quantity - item.quantity,
			});
		}

		// Decrease product quantities
		for (const productData of productsToUpdate) {
			await Product.findByIdAndUpdate(
				productData.productId,
				{ $set: { quantity: productData.newQuantity } },
				{ new: true }
			);
		}

		await inngest.send({
			name: 'order/created',
			data: {
				userId,
				address,
				items,
				amount: amount,
				date: Date.now(),
			},
		});
		const user = await User.findById(userId);
		user.cartItems = {};
		await user.save();
		return NextResponse.json({
			success: true,
			message: 'Commande passée avec succès',
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			success: false,
			message:
				'Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer.',
		});
	}
}
