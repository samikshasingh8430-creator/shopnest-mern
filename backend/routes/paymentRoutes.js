const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
    createPaymentOrder,
    verifyPayment
} = require("../controller/paymentController");

const router = express.Router();

router.post("/order", protect, createPaymentOrder);

router.post("/verify", protect, verifyPayment);

module.exports = router;