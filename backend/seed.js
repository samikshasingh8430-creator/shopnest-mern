const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');


dotenv.config();

const User = require('./model/User');
const Product = require('./model/product');

const demoUsers = [
	{
		name: 'John Doe',
		email: 'john@shopnest.test',
		password: 'User@12345',
		role: 'admin',
		verified: true
	},
	{
		name: 'Admin',
		email: 'Admin@shopnest.test',
		password: 'Customer@12345',
		role: 'user',
		verified: true
	},
	{
		name: 'Robert Wilson',
		email: 'robert@shopnest.test',
		password: 'Customer@12345',
		role: 'user',
		verified: true
	},
	{
		name: 'Emily Davis',
		email: 'emily@shopnest.test',
		password: 'Customer@12345',
		role: 'user',
		verified: true
	}
];

const demoProducts = [
	{
		name: 'Classic White Sneakers',
		description: 'Comfortable everyday sneakers with a clean, classic design.',
		price: 2499,
		category: 'Footwear',
		stock: 25,
		imageUrls: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
		rating: 4.5,
		runReviews: 18
	},
	{
		name: 'Everyday Canvas Backpack',
		description: 'A durable backpack with room for work, travel, and daily essentials.',
		price: 1799,
		category: 'Bags',
		stock: 18,
		imageUrls: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
		rating: 4.2,
		runReviews: 11
	},
	{
		name: 'Minimal Ceramic Mug',
		description: 'A simple ceramic mug for coffee, tea, and quiet mornings.',
		price: 499,
		category: 'Home',
		stock: 40,
		imageUrls: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
		rating: 4.7,
		runReviews: 24
	},
	{
		name: 'Soft Cotton T-Shirt',
		description: 'A breathable cotton t-shirt designed for comfortable everyday wear.',
		price: 899,
		category: 'Clothing',
		stock: 32,
		imageUrls: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
		rating: 4.4,
		runReviews: 15
	},
	{
		name: 'Leather Office Wallet',
		description: 'A compact leather wallet with practical card and cash storage.',
		price: 1299,
		category: 'Accessories',
		stock: 22,
		imageUrls: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
		rating: 4.3,
		runReviews: 9
	},
	{
		name: 'Wireless Headphones',
		description: 'Comfortable wireless headphones with clear sound for work and travel.',
		price: 3499,
		category: 'Electronics',
		stock: 15,
		imageUrls: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
		rating: 4.6,
		runReviews: 31
	},
	{
		name: 'Stainless Steel Water Bottle',
		description: 'A reusable insulated bottle that keeps drinks cool throughout the day.',
		price: 799,
		category: 'Lifestyle',
		stock: 35,
		imageUrls: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
		rating: 4.5,
		runReviews: 20
	},
	{
		name: 'Classic Analog Watch',
		description: 'A timeless analog watch with a clean dial and comfortable strap.',
		price: 2199,
		category: 'Accessories',
		stock: 12,
		imageUrls: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800',
		rating: 4.4,
		runReviews: 14
	},
	{
		name: 'Wooden Desk Organizer',
		description: 'A neat wooden organizer for pens, notes, and everyday desk items.',
		price: 649,
		category: 'Office',
		stock: 28,
		imageUrls: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800',
		rating: 4.1,
		runReviews: 7
	},
	{
		name: 'Relaxed Fit Denim Jeans',
		description: 'Comfortable everyday denim jeans with a relaxed modern fit.',
		price: 1899,
		category: 'Clothing',
		stock: 20,
		imageUrls: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
		rating: 4.3,
		runReviews: 12
	}
];

const seedDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/shopnest');
		console.log('Connected to MongoDB');

		for (const user of demoUsers) {
			const password = await bcrypt.hash(user.password, 10);

			await User.findOneAndUpdate(
				{ email: user.email },
				{ ...user, password },
				{ upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
			);
		}

		for (const product of demoProducts) {
			await Product.findOneAndUpdate(
				{ name: product.name },
				product,
				{ upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
			);
		}

		console.log(`Seeded ${demoUsers.length} users and ${demoProducts.length} products.`);
		console.log('Demo admin login: john@shopnest.test / User@12345');
		console.log('Demo customer login: jane@shopnest.test / Customer@12345');
	} catch (error) {
		console.error('Database seed failed:', error.message);
		process.exitCode = 1;
	} finally {
		await mongoose.disconnect();
	}
};

seedDatabase();
