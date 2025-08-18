import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			ref: 'User',
			required: true,
		},
		items: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: 'product',
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
		amount: { type: Number, required: true },
		address: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'address',
		},
		state: {
			type: String,
			enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
			default: 'pending',
		},
	},
	{ timestamps: true }
);

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;
