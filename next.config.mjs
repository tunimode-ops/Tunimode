/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: process.env.NODE_ENV === 'development',
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'raw.githubusercontent.com',
				pathname: '**',
			},
		],
	},
};

export default nextConfig;
