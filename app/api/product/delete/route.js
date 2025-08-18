import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request) {
	try {
		const { userId } = getAuth(request);
		const isSeller = await authSeller(userId);
		if (!isSeller) {
			return NextResponse.json(
				{ success: false, message: 'You are not a seller' },
				{ status: 403 }
			);
		}

		const { productId } = await request.json();
		if (!productId) {
			return NextResponse.json(
				{ success: false, message: 'Product ID is required' },
				{ status: 400 }
			);
		}

		await connectDB();

		const product = await Product.findOne({ _id: productId });
		if (!product) {
			return NextResponse.json(
				{ success: false, message: 'Product not found or not authorized' },
				{ status: 404 }
			);
		}

		// Delete images from Cloudinary
		if (product.image && product.image.length > 0) {
			await Promise.all(
				product.image.map(img => cloudinary.uploader.destroy(img.public_id))
			);
		}

		// Set images to empty array
		product.image = [];
		await product.save();

		return NextResponse.json({
			success: true,
			message: 'Images deleted successfully',
			product,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
