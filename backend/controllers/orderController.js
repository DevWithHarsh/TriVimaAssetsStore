import orderModel from '../models/orderModel.js'
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
import { incrementCouponUsage } from './couponController.js';
import { sendDownloadEmail } from '../services/emailService.js';
import paypal from '@paypal/checkout-server-sdk';

// PayPal environment setup
const environment = process.env.PAYPAL_MODE === 'live'
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const paypalClient = new paypal.core.PayPalHttpClient(environment);

// Helper function to convert INR to USD
const convertINRToUSD = (inrAmount) => {
    const exchangeRate = 0.012; // Use real-time API in production
    return (inrAmount * exchangeRate).toFixed(2);
};

// Helper function to enrich items with product data
const enrichItemsWithProductData = async (items) => {
    return await Promise.all(items.map(async (item) => {
        const product = await productModel.findById(item._id);
        return {
            ...item,
            zipFile: product?.zipFile || null,
            zipFileType: product?.zipFileType || 'upload'
        };
    }));
};

// Create PayPal order
const placeOrderPayPal = async (req, res) => {
    try {
        const { items, amount, address, couponCode, couponDiscount, originalAmount, couponType } = req.body;
        const userId = req.body.userId;

        console.log('Creating PayPal order for userId:', userId);

        // Validate couponType
        let validCouponType = null;
        if (couponType && ['percentage', 'fixed'].includes(couponType)) {
            validCouponType = couponType;
        }

        // Enrich items with ZIP file data
        const enrichedItems = await enrichItemsWithProductData(items);

        // Create order in database first
        const newOrder = new orderModel({
            userId,
            items: enrichedItems,
            amount,
            originalAmount: originalAmount || amount,
            address,
            paymentMethod: "PayPal",
            payment: false,
            date: Date.now(),
            couponCode: couponCode || null,
            couponDiscount: couponDiscount || 0,
            couponType: validCouponType
        });

        await newOrder.save();
        console.log('Order created with ID:', newOrder._id);

        // Increment coupon usage if used
        if (couponCode) await incrementCouponUsage(couponCode);

        // Reduce stock for each item
        for (const item of items) {
            const product = await productModel.findById(item._id);
            if (product) {
                product.stock -= item.quantity;
                if (product.stock < 0) product.stock = 0;
                await product.save();
            }
        }

        // Convert amount to USD for PayPal
        const usdAmount = convertINRToUSD(amount);

        // Create PayPal order
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: usdAmount
                },
                description: '3D Digital Assets Purchase',
                custom_id: newOrder._id.toString(),
                soft_descriptor: '3D Assets Store'
            }],
            application_context: {
                brand_name: 'TriVima Studio',
                landing_page: 'BILLING',
                user_action: 'PAY_NOW',
                return_url: `${process.env.FRONTEND_URL}/orders`,
                cancel_url: `${process.env.FRONTEND_URL}/cart`
            }
        });

        const paypalOrder = await paypalClient.execute(request);
        console.log('PayPal order created:', paypalOrder.result.id);

        // Store PayPal order ID in our database
        await orderModel.findByIdAndUpdate(newOrder._id, {
            paypal_order_id: paypalOrder.result.id
        });

        res.json({
            success: true,
            message: "PayPal order created successfully",
            paypalOrderId: paypalOrder.result.id,
            orderId: newOrder._id
        });

    } catch (error) {
        console.error('PayPal order creation error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Verify PayPal payment
const verifyPayPal = async (req, res) => {
    try {
        const { paypalOrderId } = req.body;

        console.log('=== PAYPAL PAYMENT VERIFICATION START ===');
        console.log('PayPal Order ID:', paypalOrderId);

        if (!paypalOrderId) {
            return res.status(400).json({ success: false, message: "PayPal order ID is required" });
        }

        // Find order in database
        const order = await orderModel.findOne({ paypal_order_id: paypalOrderId });
        if (!order) {
            return res.status(400).json({ success: false, message: "Order not found" });
        }

        console.log('Order found:', order._id);

        // Capture the PayPal payment
        const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
        request.requestBody({});

        const captureResponse = await paypalClient.execute(request);
        console.log('PayPal capture response:', captureResponse.result);

        // Check if payment was successful
        if (captureResponse.result.status === 'COMPLETED') {
            console.log('✅ PayPal payment completed successfully');

            // Update order status
            const updatedOrder = await orderModel.findByIdAndUpdate(
                order._id,
                {
                    status: 'Digital Asset Ready',
                    payment: true,
                    paypal_payment_id: captureResponse.result.id,
                    paypal_payer_id: captureResponse.result.payer?.payer_id
                },
                { new: true }
            );

            console.log('✅ Order updated:', updatedOrder._id);

            // Send download email
            try {
                if (order.userId) {
                    const user = await userModel.findById(order.userId);
                    if (user && user.email) {
                        console.log('📧 Sending download email to:', user.email);
                        await sendDownloadEmail(
                            user.email,
                            user.name || 'Customer',
                            order.items,
                            order._id
                        );
                        console.log('✅ Download email sent successfully');
                    }
                }
            } catch (emailError) {
                console.error('⚠️ Email sending failed (non-critical):', emailError.message);
            }

            res.json({
                success: true,
                message: "PayPal payment verified successfully! Your 3D assets are now available for download.",
                order: updatedOrder
            });

        } else {
            console.log('❌ PayPal payment not completed:', captureResponse.result.status);
            res.status(400).json({
                success: false,
                message: "PayPal payment was not completed"
            });
        }

    } catch (error) {
        console.error('❌ PayPal verification error:', error);
        res.status(500).json({
            success: false,
            message: "Server error during PayPal verification: " + error.message
        });
    }
};

// All orders data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// User Order Data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update order status from admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Remove order (for admin)
const removeOrder = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        await orderModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Order deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to delete order", error });
    }
};

// Remove user order (for payment cancellation)
const removeUserOrder = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        const order = await orderModel.findById(id);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Restore stock for cancelled order
        for (const item of order.items) {
            const product = await productModel.findById(item._id);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        await orderModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Order cancelled successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to cancel order", error });
    }
};

export { 
    placeOrderPayPal,
    verifyPayPal,
    allOrders, 
    userOrders, 
    updateStatus, 
    removeOrder,
    removeUserOrder
}