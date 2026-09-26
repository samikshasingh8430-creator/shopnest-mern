const Razorpay = require("razorpay");
const crypto = require("crypto");
const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");
require("dotenv").config();


// CREATE RAZORPAY ORDER
const createPaymentOrder = async (req, res) => {
    try {
        const amount = Number(req.body.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than zero" });
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes("*")) {
            return res.status(500).json({
                message: "Payment gateway is not configured. Add valid Razorpay test credentials.",
            });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const order = await instance.orders.create(options);

        res.status(201).json({
            key: process.env.RAZORPAY_KEY_ID,
            razorpayOrderId: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt
        });

    } catch (error) {
        console.error("Razorpay Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// VERIFY RAZORPAY PAYMENT
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Payment details are required" });
        }

        const isValid = validatePaymentVerification(
            { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
            razorpay_signature,
            process.env.RAZORPAY_KEY_SECRET
        );

        if (!isValid) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        res.status(200).json({
            message: "Payment verified successfully",
            razorpayOrderId: razorpay_order_id,
            paymentId: razorpay_payment_id
        });
     } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: "Server error" });
    }

};

// EXPORT BOTH FUNCTIONS
module.exports = {
    createPaymentOrder,
    verifyPayment
};