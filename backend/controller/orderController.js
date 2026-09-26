const Order = require('../model/Order.js');

const sendEmail = require('../utils/sendEmail');


// Create a new order
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId, razorpayOrderId } = req.body;

        if (!Array.isArray(items) || items.length === 0 || !Number.isFinite(Number(totalAmount)) || Number(totalAmount) <= 0 || !address) {
            return res.status(400).json({
                message: 'Invalid order data'
            });
        }

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount: Number(totalAmount),
            address,
            paymentId,
            razorpayOrderId
        });

        await order.save();

        const message = `Dear ${req.user.name},

Thank you for your order!

Your order has been successfully created.

Order ID: ${order.orderId}
Total Amount: $${totalAmount}
Shipping Address: ${address}

We will notify you once your order is shipped.

Best regards,
ShopNest Team`;

        await sendEmail(
            req.user.email,
            'Order Created',
            message
        );

        res.status(201).json({
            message: 'Order created successfully',
            order,
            orderId: order.orderId
        });

    } catch (error) {
        console.log("CREATE ORDER ERROR:", error);

        res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};


// Get my orders
const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).populate('items.productId', 'name price');

        res.status(200).json(orders);

    } catch (error) {
        console.log("MY ORDERS ERROR:", error);

        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message
        });
    }
};


// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', '_id name');

        res.status(200).json(orders);

    } catch (error) {
        console.log("GET ORDERS ERROR:", error);

        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message
        });
    }
};


// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        order.status = status;

        await order.save();

        res.status(200).json({
            message: 'Order status updated',
            order
        });

    } catch (error) {
        console.log("UPDATE ORDER ERROR:", error);

        res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
};


module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus
};