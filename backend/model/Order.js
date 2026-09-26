const mongoose = require('mongoose');
const crypto = require('crypto');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        default: () => `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
    },
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    items:[
        {
            productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},
            qty:{type:Number,required:true,min:1},
            price:{ type:Number,required:true}
        }
    ],
    totalAmount:{type:Number,required:true},
    address:{
        fullName:{type:String,required:true},
        street:{type:String,required:true},
        city:{type:String,required:true},
        postalCode:{type:String,required:true},
        country:{type:String,required:true}
    },
    razorpayOrderId:{type:String},
    paymentId:{type:String},
    status:{type:String,enum:['pending','shipped','delivered'],default: 'pending'}

},  {timestamps:true});

module.exports = mongoose.model('Order',orderSchema)