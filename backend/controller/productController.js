const Product = require('../model/product');
const cloudinary = require('../config/cloudinary');
const fs = require("fs");


// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({
                message: 'Product not found'
            });
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Create product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            stock,
           
        } = req.body;

        let imageUrl = "";


        console.log("FILES:", req.files);


        // Upload image to Cloudinary
        if (req.files && req.files.imageUrl) {

            const result = await cloudinary.uploader.upload(
                req.files.imageUrl.tempFilePath
            );
            

            imageUrl = result.secure_url;
        }

        // Create product
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrls:imageUrl
        });

        // Save product
        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const{name,description,price,category,stock} = req.body;
        const product = await Product.findById(req.params.id);

        if(product){    
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock; 

            if(req.file) {
                const result = await cloudinary.uploader.upload
                (req.files.Path);
                product.imageUrl = result.secure_url;
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({
                message: 'Product not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({
                message: 'Product not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};