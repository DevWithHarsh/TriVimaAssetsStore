import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product 
const addProduct = async (req, res) => {
    try {
        const { name, description, price, cost, category, subCategory, bestseller, zipFileType, driveLink, tag } = req.body;

        // Handle images
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter(Boolean);

        let imageUrls = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        // ✅ Handle ZIP file based on type
        let zipFileUrl = null;
        let finalZipFileType = zipFileType || 'upload';

        if (zipFileType === 'drive_link' && driveLink) {
            // Use Google Drive link directly
            zipFileUrl = driveLink;
            finalZipFileType = 'drive_link';
        } else if (req.files?.zipFile?.[0]) {
            // Upload ZIP file to Cloudinary
            const zipFileResult = await cloudinary.uploader.upload(
                req.files.zipFile[0].path, 
                { resource_type: 'raw' } // Important: use 'raw' for ZIP files
            );
            zipFileUrl = zipFileResult.secure_url;
            finalZipFileType = 'upload';
        }

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            cost: Number(cost),
            subCategory,
            bestseller: bestseller === "true",
            image: imageUrls,
            zipFile: zipFileUrl,
            zipFileType: finalZipFileType,
            tag: tag || 'hotNew',
            date: Date.now(),
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: 'Product Added' });

    } catch (error) {
        console.error('Add Product Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// function for list product
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// function for remove product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productID } = req.body;
        const product = await productModel.findById(productID);
        res.json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add stock controller
const addStock = async (req, res) => {
    try {
        const { id, quantity } = req.body;
        const product = await productModel.findById(id);
        if (!product) return res.json({ success: false, message: "Product not found" });

        product.stock = (product.stock || 0) + Number(quantity);
        await product.save();

        res.json({ success: true, message: "Stock added successfully", stock: product.stock });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// Remove stock controller
const removeStock = async (req, res) => {
    try {
        const { id, quantity } = req.body;
        const product = await productModel.findById(id);
        if (!product) return res.json({ success: false, message: "Product not found" });

        product.stock = Math.max((product.stock || 0) - Number(quantity), 0);
        await product.save();

        res.json({ success: true, message: "Stock removed successfully", stock: product.stock });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export { listProduct, addProduct, removeProduct, singleProduct, addStock, removeStock };