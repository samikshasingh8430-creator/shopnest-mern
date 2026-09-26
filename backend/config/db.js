const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully");

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);

        console.dir(error.reason?.servers, {
            depth: 5
        });

        process.exit(1);
    }
};

module.exports = connectDB;