const mongoose = require("mongoose");
const client = mongoose.Schema({
    Name:{
        type: String,
        required: true,
    },
    Email:{
        type: String,
        required: true,
    },
    Phone_Number:{
        type: String,
        required: true,
    },
    
});
const stores = mongoose.Schema({
    Client_id:{
        type:String,
        required:true,
    },
    Store_Name:{
        type:String,
        required:true,
    },
    Website:{
        type:String,
        required:true,
    },
    Address:{
        type:String,
        required:true,
    },
    City:{
        type:String,
        required:true,
    },
    Country:{
        type:String,
        required:true,
    },
    Postal_Code:{
        type:String,
        required:true,
    },
   Geo_Location:{
        type:String,
        required:true,
    },
    Logo:{
        type:String,
        required:true,
    },
    Shop_Images:{
        type:Array,
        required:true,
    },
    
})
const customer = mongoose.Schema({
    Client_id:{
        type:String,
        required:true,
    },
    Store_id:{
        type:String,
    },
    Customer_Name:{
        type:String,
        required:true,
    },
    Phone:{
        type:String,
        required:true,
    },
    Address:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
    },
    Customer_Images:{
        type:Array,
        required:true,
    },
    
})
const order = mongoose.Schema({
    Client_id:{
        type:String,
        required:true,
    },
    
    Order_Price:{
        type:Number,
        required:true,
    },
    Cloth_Id:{
        type:String,
        required:true,
    },
    Delivery_Date:{
        type:Date,
        required:true,
    },
    Trial_Date:{
        type:Date,
        required:true,
    },
    Advance_Payment:{
        type:Array,
        required:true,
    },
    
});
const cloth = mongoose.Schema({
    
    
    
    Cloth_Type:{
        type:String,
        required:true,
    },
    Measurment:{
        type:Object,
        required:true,
    },
   
    
    

});

const measurment = mongoose.Schema(

    {
        Order_id:{
            type:String,
            required:true,
        },
        Mesurment:{
            type:Object,
            required:true,
        }
    }
) 

const Client = mongoose.model("Clients",client);
const Stores = mongoose.model("Store",stores);
const Customer = mongoose.model("Customer",customer);
const Order = mongoose.model("Order",order);
const Cloth = mongoose.model("Cloth",cloth);
const Measurment = mongoose.model("Measurment",measurment);
module.exports = {
    Client,
    Stores,
    Customer,
    Order,
    Cloth,
    Measurment
}