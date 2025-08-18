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

export async function PUT(request) {
	try {
		const { userId } = getAuth(request);
		const isSeller = await authSeller(userId);
		if (!isSeller) {
			return NextResponse.json(
				{ success: false, message: 'You are not a seller' },
				{ status: 403 }
			);
		}

		const formData = await request.formData();
		console.log(formData);

		const productId = formData.get('productId');
		if (!productId) {
			return NextResponse.json(
				{ success: false, message: 'Product ID is required' },
				{ status: 400 }
			);
		}

		const name = formData.get('name');
		const description = formData.get('description');
		const selectedCategories = JSON.parse(
			formData.get('selectedCategories') || '[]'
		);
		const newCategories = formData.get('newCategories') || '';

		const combinedCategories = [
			...selectedCategories,
			...newCategories.split(',').map(c => c.trim()),
		];

		const categories = [
			...new Set(
				combinedCategories.map(c => c.toLowerCase().trim()).filter(c => c)
			),
		];
		const price = formData.get('price');
		const offerPrice = formData.get('offerPrice');
		const shop = formData.get('shop');
		const quantity = formData.get('quantity'); // Get quantity data
		const options = formData.get('options'); // JSON string
		const parsedOptions = options ? JSON.parse(options) : [];

		const existingImagesRaw = formData.getAll('existingImages'); // URLs to keep
		const existingImages = existingImagesRaw.map(imgStr => JSON.parse(imgStr));
		const newImageFiles = formData.getAll('newImages'); // newly uploaded files
		await connectDB();

		const productToUpdate = await Product.findOne({ _id: productId });
		if (!productToUpdate) {
			return NextResponse.json(
				{ success: false, message: 'Product not found or not authorized' },
				{ status: 404 }
			);
		}

		// 1️⃣ Delete images from Cloudinary that are not kept
		const imagesToDelete = productToUpdate.image.filter(
			img => !existingImages.some(existingImg => existingImg.url === img.url)
		);

		await Promise.all(
			imagesToDelete.map(img => cloudinary.uploader.destroy(img.public_id))
		);

		// 2️⃣ Keep existing images
		const keptImages = productToUpdate.image.filter(img =>
			existingImages.some(existingImg => existingImg.url === img.url)
		);

		// 3️⃣ Upload new images
		let uploadedNewImages = [];
		if (newImageFiles && newImageFiles.length > 0) {
			const uploadResults = await Promise.all(
				newImageFiles.map(async file => {
					const arrayBuffer = await file.arrayBuffer();
					const buffer = Buffer.from(arrayBuffer);

					return new Promise((resolve, reject) => {
						const stream = cloudinary.uploader.upload_stream(
							{ resource_type: 'auto' },
							(error, result) => {
								if (error) reject(error);
								else resolve(result);
							}
						);
						stream.end(buffer);
					});
				})
			);

			uploadedNewImages = uploadResults.map(res => ({
				url: res.secure_url,
				public_id: res.public_id,
			}));
		}

		// 4️⃣ Combine kept + new images
		const finalImages = [...keptImages, ...uploadedNewImages];

		// 5️⃣ Update product
		const updatedProduct = await Product.findOneAndUpdate(
			{ _id: productId },
			{
				...(name && { name }),
				...(description && { description }),
				...(categories && { categories }),
				...(price && { price: Number(price) }),
				...(offerPrice && {
					offerPrice:
						Number(offerPrice) > 0 && Number(offerPrice) < Number(price)
							? Number(offerPrice)
							: Number(price),
				}),
				...(shop && { shop }),
				...(options && { options: parsedOptions }),
				...(quantity && { quantity: Number(quantity) }), // Update quantity
				image: finalImages,
			},
			{ new: true }
		);

		return NextResponse.json({
			success: true,
			message: 'Product updated successfully',
			updatedProduct,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
