import connectDB from '@/config/db';
import Address from '@/models/Address';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const { userId } = getAuth(request);
		await connectDB();

		const addresses = await Address.find({ userId });
		console.log(addresses);

		return NextResponse.json({
			success: true,
			addresses,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({ success: false, message: error.message });
	}
}
