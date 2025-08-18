import { Inngest } from 'inngest';
import connectDB from './db';
import User from '@/models/User';
import Order from '@/models/Order';

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
		const orders = events.map(event => {
			return {
				userId: event.data.userId,
				items: event.data.items,
				amount: event.data.amount,
				address: event.data.address,
			};
		});

		await connectDB();
		await Order.insertMany(orders);
		return {
			success: true,
			processed: orders.length,
		};
	}
);
