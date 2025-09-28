import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// Test endpoint to check database data
const testDatabaseData = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const orderCount = await Order.countDocuments();
        const productCount = await Product.countDocuments();

        // Get sample records to see structure
        const sampleUser = await User.findOne();
        const sampleOrder = await Order.findOne();
        const sampleProduct = await Product.findOne();

        res.json({
            counts: {
                users: userCount,
                orders: orderCount,
                products: productCount
            },
            sampleData: {
                user: sampleUser,
                order: sampleOrder,
                product: sampleProduct
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const { timeRange = '7days' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case '7days':
                startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
                break;
            case '30days':
                startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
                break;
            case '90days':
                startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
                break;
            case '1year':
                startDate = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
                break;
            default:
                startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        }

        // Get total users (all time)
        const totalUsers = await User.countDocuments();

        // Get total orders (all time)
        const totalOrders = await Order.countDocuments();

        // Get orders for revenue calculation (exclude cancelled orders)
        const allOrders = await Order.find({
            status: { $nin: ['cancelled', 'refunded'] }
        });

        // Calculate total revenue using 'amount' field
        const totalRevenue = allOrders.reduce((sum, order) => {
            return sum + (order.amount || 0);
        }, 0);

        // Calculate total profit using product cost and price
        let totalProfit = 0;
        for (const order of allOrders) {
            for (const item of order.items) {
                const product = await Product.findById(item._id || item.productId);
                if (product) {
                    totalProfit += ((product.price - product.cost) * (item.quantity || 1));
                }
            }
        }

        // Get active orders (processing, confirmed, shipped, Order Placed)
        const activeOrders = await Order.find({
            status: {
                $in: [
                    'Order Placed',
                    'Packing',
                    'Processing',
                    'Confirmed',
                    'Shipped',
                    'Out for Delivery'
                ]
            }
        })
            .populate('userId', 'name email')
            .sort({ date: -1 })
            .limit(10);

            
        // Format active orders
        const formattedActiveOrders = activeOrders.map(order => ({
            _id: order._id,
            customerName: order.userId?.name || order.address?.firstName + ' ' + order.address?.lastName || 'Guest User',
            customerEmail: order.userId?.email || '',
            items: order.items || [],
            totalAmount: order.amount || 0, // Use amount field
            status: order.status || 'Order Placed',
            createdAt: order.date // Use date field
        }));

        // Generate revenue chart data (last 8 months)
        const revenueData = await generateRevenueChartData();

        // Generate profit chart data (last 4 weeks)
        const profitData = await generateProfitChartData();

        res.status(200).json({
            success: true,
            totalUsers,
            totalOrders,
            totalRevenue,
            totalProfit,
            activeOrders: formattedActiveOrders,
            revenueData,
            profitData
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};

// Helper function to generate revenue chart data
const generateRevenueChartData = async () => {
    try {
        const months = [];
        const currentDate = new Date();

        for (let i = 7; i >= 0; i--) {
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);

            const monthOrders = await Order.find({
                date: { // Use date field instead of createdAt
                    $gte: startOfMonth,
                    $lte: endOfMonth
                },
                status: { $nin: ['cancelled', 'refunded'] }
            });

            const revenue = monthOrders.reduce((sum, order) => sum + (order.amount || 0), 0); // Use amount field
            const profit = revenue * 0.3; // 30% profit margin assumption

            months.push({
                name: startOfMonth.toLocaleDateString('en-US', { month: 'short' }),
                revenue,
                profit
            });
        }

        return months;
    } catch (error) {
        console.error('Revenue chart error:', error);
        return [];
    }
};

// Helper function to generate profit chart data
const generateProfitChartData = async () => {
    try {
        const weeks = [];
        const currentDate = new Date();

        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(currentDate);
            weekStart.setDate(currentDate.getDate() - (i * 7));
            weekStart.setHours(0, 0, 0, 0);

            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);

            const weekOrders = await Order.find({
                date: { // Use date field instead of createdAt
                    $gte: weekStart,
                    $lte: weekEnd
                },
                status: { $nin: ['cancelled', 'refunded'] }
            });

            let weeklyProfit = 0;
            for (const order of weekOrders) {
                for (const item of order.items) {
                    const product = await Product.findById(item._id || item.productId);
                    if (product) {
                        weeklyProfit += ((product.price - product.cost) * (item.quantity || 1));
                    }
                }
            }

            weeks.push({
                name: `Week ${4 - i}`,
                profit: weeklyProfit
            });
        }

        return weeks;
    } catch (error) {
        console.error('Profit chart error:', error);
        return [];
    }
};

export {
    getDashboardStats,
    testDatabaseData
};