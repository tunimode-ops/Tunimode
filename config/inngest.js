import { Inngest } from 'inngest';
import connectDB from './db';
import User from '@/models/User';
import Order from '@/models/Order';
import emailjs from 'emailjs-com';
import { assets } from '@/assets/assets';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'tunimode-next' });

// inngest function to save user data to database
export const syncUserCreation = inngest.createFunction(
	{ id: 'sync-user-from-clerk' },
	{ event: 'clerk/user.created' },
	async ({ event }) => {
		// Example: Save user data to database
		const { id, first_name, last_name, email_addresses, image_url } =
			event.data;
		const userData = {
			_id: id,
			email: email_addresses[0].email_address,
			name: first_name + ' ' + last_name,
			imageUrl: image_url,
		};
		// Replace with actual DB logic
		await connectDB();
		await User.create(userData);
	}
);

// inngest function to update user data to database
export const syncUserUpdation = inngest.createFunction(
	{ name: 'update-user-from-clerk' },
	{ event: 'clerk/user.updated' },
	async ({ event }) => {
		// Example: Save user data to database
		const { id, first_name, last_name, email_addresses, image_url } =
			event.data;
		const userData = {
			_id: id,
			email: email_addresses[0].email_address,
			name: first_name + ' ' + last_name,
			imageUrl: image_url,
		};
		// Replace with actual DB logic
		await connectDB();
		await User.findByIdAndUpdate(id, userData);
	}
);

// inngest function to delete user data to database
export const syncUserDeletion = inngest.createFunction(
	{ id: 'delete-user-from-clerk' },
	{ event: 'clerk/user.deleted' },
	async ({ event }) => {
		// Example: Save user data to database
		const { id } = event.data;
		// Replace with actual DB logic
		await connectDB();
		await User.findByIdAndDelete(id);
	}
);

// inngest function to create user's order data to database

export const createUserOrder = inngest.createFunction(
	{
		id: 'create-user-order',
		batchEvents: {
			maxSize: 5,
			timeout: '5s',
		},
	},
	{ event: 'order/created' },
	async ({ events }) => {
		await connectDB();
		const insertedOrders = [];

		for (const event of events) {
			const { userId, address, items, amount, date } = event.data;
			const idempotencyKey = `${userId}-${amount}-${date}`; // Unique key for idempotency

			// Check if an order with this idempotency key already exists (optional, but good for robustness)
			// For Inngest's built-in idempotency, this might not be strictly necessary here,
			// but it adds an extra layer of protection if the event ID changes for some reason.
			const existingOrder = await Order.findOne({
				userId,
				amount,
				createdAt: new Date(date), // Assuming createdAt is set to the event date
			});

			if (existingOrder) {
				console.log(
					`Order with idempotency key ${idempotencyKey} already exists. Skipping.`
				);
				continue;
			}

			const order = {
				userId,
				items,
				amount,
				address,
				createdAt: new Date(date), // Set creation date from event data
			};

			const newOrder = await Order.create(order);
			insertedOrders.push(newOrder);
		}

		// send email notification
		if (insertedOrders.length > 0) {
			for (const order of insertedOrders) {
				try {
					const user = await User.findById(order.userId);
					if (!user) continue;

					// Assuming Address model is imported or available
					const Address = (await import('@/models/Address')).default;
					const Product = (await import('@/models/Product')).default;

					const fullAddress = await Address.findById(order.address);
					const addressText = fullAddress
						? `${fullAddress.fullName}, ${fullAddress.area}, ${
								fullAddress.city
						  }, ${fullAddress.state || ''}, ${fullAddress.pincode}`
						: 'Adresse inconnue';

					// Fetch product details
					const itemsWithDetails = [];
					for (const i of order.items) {
						const product = await Product.findById(i.product);
						if (product) {
							itemsWithDetails.push({
								name: product.name,
								quantity: i.quantity,
								price: product.price,
								offerPrice: product.offerPrice,
								imageUrl: product?.image?.[0]?.url || assets.placeholder,
							});
						}
					}

					await emailjs.send(
						'service_8wof16i', // Remplace par ton Service ID EmailJS
						'template_er2dcz8', // Remplace par ton Template ID EmailJS
						{
							to_name: user.fullName || user.name || 'Client',
							to_email: user.email,
							order_id: order._id.toString(),
							amount: order.amount,
							address: addressText,
							items: itemsWithDetails
								.map(
									i =>
										`<li style="display:flex; align-items:center; margin-bottom:10px;">
           <img src="${i.imageUrl}" alt="${
											i.name
										}" style="width:60px; height:60px; object-fit:cover; border-radius:6px; margin-right:10px;">
           <span>${i.name} x ${i.quantity} - ${
											i.offerPrice > 0 && i.offerPrice < i.price
												? i.offerPrice
												: i.price
										} DT</span>
         </li>`
								)
								.join(''),
						},
						'yWpbuDTAtjZannpid' // Remplace par ta Public Key EmailJS
					);
				} catch (err) {
					console.error('Erreur EmailJS :', err);
				}
			}
		}

		return {
			success: true,
			processed: insertedOrders.length,
		};
	}
);
