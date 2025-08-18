'use client';
import { useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const AppContext = createContext();

export const useAppContext = () => {
	return useContext(AppContext);
};

export const AppContextProvider = props => {
	const currency = 'TND';
	const router = useRouter();

	const { user } = useUser();
	const { getToken } = useAuth();

	const [products, setProducts] = useState([]);
	const [userData, setUserData] = useState(false);
	const [isSeller, setIsSeller] = useState(true);
	const [cartItems, setCartItems] = useState({});
	const [allCategories, setAllCategories] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchProductData = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get('/api/product/list');
			if (data.success) {
				setProducts(data.products);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchUserData = async () => {
		try {
			setLoading(true);
			if (user.publicMetadata.role === 'seller') {
				setIsSeller(true);
			} else {
				setIsSeller(false);
			}
			const token = await getToken();

			const { data } = await axios.get('/api/user/data', {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (data.success) {
				setUserData(data.user);
				setCartItems(data.user.cartItems);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	// Modified addToCart to accept selectedOptions and respect stock
	const addToCart = async (itemId, selectedOptions = {}, quantityToAdd = 1) => {
		try {
			setLoading(true);
			let cartData = structuredClone(cartItems);
			const itemKey = JSON.stringify({ itemId, selectedOptions });

			const product = products.find(p => p._id === itemId);
			if (!product) {
				toast.error('Product not found.');
				return;
			}

			const currentQuantityInCart = cartData[itemKey] || 0;
			const newQuantityInCart = currentQuantityInCart + quantityToAdd;

			if (newQuantityInCart > product.quantity) {
				toast.error(
					`Cannot add more than available stock. Available: ${product.quantity}`
				);
				return;
			}

			cartData[itemKey] = newQuantityInCart;
			setCartItems(cartData);

			if (user) {
				try {
					const token = await getToken();
					await axios.post(
						'/api/cart/update',
						{ cartData },
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					toast.success('Item added to cart');
				} catch (error) {
					console.log(error);
					toast.error(error.message);
				}
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const updateCartQuantity = async (itemKey, quantity) => {
		try {
			setLoading(true);
			let cartData = structuredClone(cartItems);
			const { itemId } = JSON.parse(itemKey);
			const product = products.find(p => p._id === itemId);

			if (!product) {
				toast.error('Product not found.');
				return;
			}

			if (quantity > product.quantity) {
				toast.error(
					`Cannot set quantity more than available stock. Available: ${product.quantity}`
				);
				return;
			}

			if (quantity === 0) {
				delete cartData[itemKey];
			} else {
				cartData[itemKey] = quantity;
			}
			setCartItems(cartData);
			if (user) {
				try {
					const token = await getToken();
					await axios.post(
						'/api/cart/update',
						{ cartData },
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					);
					toast.success('Cart Updated!');
				} catch (error) {
					toast.error(error.message);
				}
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const getCartCount = () => {
		let totalCount = 0;
		for (const itemKey in cartItems) {
			const { itemId } = JSON.parse(itemKey);
			let itemInfo = products.find(product => product._id === itemId);
			if (cartItems[itemKey] > 0 && itemInfo) {
				totalCount += cartItems[itemKey];
			}
		}
		return totalCount;
	};

	const getCartAmount = () => {
		let totalAmount = 0;
		for (const itemKey in cartItems) {
			const { itemId } = JSON.parse(itemKey); // Extract itemId from the unique key
			let itemInfo = products.find(product => product._id === itemId);
			if (cartItems[itemKey] > 0 && itemInfo) {
				totalAmount +=
					(itemInfo.offerPrice < itemInfo.price && itemInfo.offerPrice > 0
						? itemInfo.offerPrice
						: itemInfo.price) * cartItems[itemKey];
			}
		}
		return Math.floor(totalAmount * 100) / 100;
	};

	const fetchCategories = async () => {
		try {
			const { data } = await axios.get('/api/product/categories');
			if (data.categories) {
				setAllCategories(data.categories);
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchProductData();
		fetchCategories();
	}, []);

	useEffect(() => {
		if (user) {
			fetchUserData();
		}
	}, [user]);

	const value = {
		user,
		getToken,
		currency,
		router,
		isSeller,
		setIsSeller,
		userData,
		fetchUserData,
		products,
		fetchProductData,
		cartItems,
		setCartItems,
		addToCart,
		updateCartQuantity,
		getCartCount,
		getCartAmount,
		allCategories,
		setAllCategories,
		loading,
		setLoading,
	};

	return (
		<AppContext.Provider value={value}>{props.children}</AppContext.Provider>
	);
};
