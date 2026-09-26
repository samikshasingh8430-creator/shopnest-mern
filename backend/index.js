const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const Path = require("path");
const connectDB =require ("./config/db");
const fileUpload = require("express-fileupload");

dotenv.config();



const app = express();

app.use(cors(
    {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000',process.env.FRONTEND_URL],
        credentials:true
    }
));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/"
}));


app.use("/api/auth/", require("./routes/authRoutes"));
app.use("/api/product/", require("./routes/productRoutes"));
app.use("/api/orders/", require("./routes/orderRoutes"));
app.use("/api/payment",require("./routes/paymentRoutes"));
app.use("/api/analytics",require("./routes/analyticsRoutes"));



// Serve frontend in production

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(Path.join(__dirname, '../frontend/build')));

    app.get('/{*path}',(req,res)=>{
        res.sendFile(Path.resolve(__dirname,'../frontend/build/index.html'))
    })
}else{
    app.get('/',(req,res)=>{
        res.send('ShopNest API is running in Development mode...')
    })};


const PORT = process.env.PORT ||5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start server:", error.message);
        process.exit(1);
    }
};

startServer();





