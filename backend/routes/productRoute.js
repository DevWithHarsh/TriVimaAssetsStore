import express from 'express'
import { listProduct, addProduct, removeProduct, singleProduct } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import { addStock, removeStock } from '../controllers/productController.js';

const productRouter = express.Router();

// ✅ Updated route to handle ZIP file uploads
productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'zipFile', maxCount: 1 } // Add ZIP file support
  ]),
  addProduct
);

productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProduct);
productRouter.post('/add-stock', addStock);
productRouter.post('/remove-stock', removeStock);

export default productRouter;