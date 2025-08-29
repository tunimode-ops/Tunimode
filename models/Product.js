import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
	userId: { type: String, ref: 'user' },
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	offerPrice: {
		type: Number,
		required: true,
		default: 0,
	},
	description: {
		type: String,
		required: true,
	},
	image: {
		type: [
			{
				url: { type: String, required: true },
				public_id: { type: String, required: true },
			},
		],
		required: true,
	},
	categories: {
		type: [String],
		required: true,
	},
	shop: {
		type: String,
		required: true,
		enum: ['Nouveau', 'Fripe'],
	},
	test: {
		type: String,
		required: true,
		default: 'test',
	},

	// Add the new options field
	options: {
		type: [
			{
				name: { type: String, required: true },
				values: { type: [String], required: true },
			},
		],
		validate: {
			validator: function (options) {
				return (
					Array.isArray(options) && options.every(opt => opt.name && opt.values)
				);
			},
			message: 'Invalid options format',
			required: true,
		},
		default: [],
	},
	date: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		default: 0,
	},
});

const Product =
	mongoose.models.product || mongoose.model('product', productSchema);

export default Product;
