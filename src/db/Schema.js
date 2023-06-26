const mongoose = require("mongoose");
const client = mongoose.Schema({
    UserID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    BusinessName:{
        type: String,
        required: true,
    },
    BusinessEmail:{
        type: String,
        required: true,
    },
    BusinessPhone:{
        type: String,
        required: true,
    },
    BusinessAddress:{
        type: String,
        required: true,
    },
    City:{
        type: String,
        required: true,
    },
    State:{
        type: String,
        required: true,
    },
    Zip:{
        type: String,
        required: true,
    },
    Country:{
        type: String,
        required: true,
    },
    PrimaryContactName:{
        type: String,
        required: true,
    },
    PrimaryContactEmail:{
        type: String,
        required: true,
    },
    PrimaryContactPhone:{
        type: String,
        required: true,
    },
    LogoUrl:{
        type: String,
        required: true,
    },
    CoverPhotoUrl:{
        type: String,
        required: true,
    },
    IsActive:{
        type: Boolean,
        required: true,
        default:true,
    },
    
    
    
},{
    timestamps:true
});
const users = mongoose.Schema({
    Username:{
        type:String,
        required:true
    },
    HashedPassword:{
        type:String,
        required:true
    },
    LastLoginFromIp:{
        type:String,
        required:true
    },
    LastLoginAt:{
        type:String,
        required:true
    }
},{
    timestamps:true
});
const role = mongoose.Schema({
    RoleId:{
        type:Number,
        required:true
    },
    RoleName:{
        type:String,
        required:true
    }
},{
    timestamps:true
});
const userInRole = mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    RoleId:{
        type:String,
        required:true
    }

},{
    timestamps:true
});
const clientShops = mongoose.Schema({
    
    ClientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Clients",
        required:true,
    },
    StoreName:{
        type:String,
        required:true,
    },
    PrimaryContactName:{
        type:String,
        required:true,
    },
    PrimaryContactPhone:{
        type:String,
        required:true,
    },
    PrimaryContactEmail:{
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
   State:{
        type:String,
        required:true,
    },
    Zip:{
        type:String,
        required:true,
    },
    Country:{
        type:String,
        required:true,
    },
    
},{
    timestamps:true
});
const customers = mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    FullName:{
        type:String,
    },
    Phone1:{
        type:String, 
        required:true,
    },
    Phone2:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
    },
    Address:{
        type:String,
        required:true,
    },
    City:{
        type:String,
        required:true,
    },
    State:{
        type:String,
        required:true,
    },
    Zip:{
        type:String,
        required:true,
    },
    Country:{
        type:String,
        required:true,
    },
    IsActive:{
        type:Boolean,
        required:true,
        default:true
    }

    
},{
    timestamps:true
});
const productType = mongoose.Schema({
    Title:{
        type:String,
        required:true
    },
    ImageUrl:{
        type:String,
        required:true,
    },
    MeasurmentAttribute:{
        type:Object,
        required:true
    }

});
const clientProductType = mongoose.Schema(
    {
        Client_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Clients",
            required:true
        },
        Title:{
            type:String,
            required:true
        },
        ImageUrl:{
            type:String,
            required:true,
        },
        MeasurmentAttribute:{
            type:Object,
            required:true
        }
    }
);
const order = mongoose.Schema({
    OrderId:{
        type:String,
        required:true,
    },
    ClientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Clients",
        required:true,
    },
    CustomerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true,
    },
    OrderPlacedDate:{
        type:Date,
        required:true,
        default: Date.now
    },
    Status:{
        type:String,
        required:true,
    },
    OrderType:{
        type:String,
        required:true,
    },
    BillingFullName:{
        type:String,
        required:true,
    },
    BillingAddress:{
        type:String,
        required:true,
    },
    BillingCity:{
        type:String,
        required:true,
    },
    BillingState:{
        type:String,
        required:true,
    },
    BillingZip:{
        type:String,
        required:true
    },
    BillingCountry:{
        type:String,
        required:true,
    },
    ShippingFullName:{
        type:String,
        required:true,
    },
    ShippingAddress:{
        type:String,
        required:true,
    },
    ShippingCity:{
        type:String,
        required:true,
    },
    ShippingState:{
        type:String,
        required:true,
    },
    ShippingZip:{
        type:String,
        required:true,
    },
    ShippingCountry:{
        type:String,
        required:true,
    },
    CompletedAt:{
        type:String,
        required:true,
    },
    AdditionalComments:{
        type:String,
        required:true,
    },
    
},{
    timestamps:true
});
const orderItem = mongoose.Schema({
    OrderId:{
        type:String,
        ref:"Order",
        required:true,
    },
    ProductTypeId:{
        type:String,
        required:true,
    },
    MeasurmentAttributeValues:{
        type:Object,
        required:true,
    },
    ItemCost:{
        type:Number,
        required:true,
    },
    ItemDiscount:{
        type:Number,
        required:true,
    },
    ItemSalesTax:{
        type:Number,
        required:true,
    },
    DeliveryPickupStatus:{
        type:Number,
        required:true,
    },
    ItemStatus:{
        type:String,
        required:true,
    },
    TrialDate:{
        type:Date,
        required:true,
    },
   CompletedAt:{
    type:String,
    required:true,
   },
   AdditionalComments:{
    type:String,
    required:true,
   },
   ExpectedCompletionDate:{
    type:Date,
    required:true,
   },
},{
    timestamps:true
});
const orderPayment = mongoose.Schema(
    {
        OrderId:{
            type:String,
            ref:"Order",
            required:true,
        },
        PaymentAmount:{
            type:Object,
            required:true,
        },
        AdditionalComments:{
            type:String,
            required:true,
        },
        PaymentDate:{
            type:Date,
            required:true,
        }
    },
    {
        timestamps:true,
    }
); 
const Client = mongoose.model("Clients",client);
const Users = mongoose.model("User",users);
const Role = mongoose.model("Role",role);
const UserInRole = mongoose.model("UserInRole",userInRole);
const ClientShops = mongoose.model("ClientShop",clientShops)
const Customer = mongoose.model("Customer",customers);
const ProductType = mongoose.model("ProductType",productType);
const Order = mongoose.model("Order",order);
const OrderItem = mongoose.model("OrderItem",orderItem);
const OrderPayment = mongoose.model("OrderPayment",orderPayment);
const ClientProductType = mongoose.model("ClientProductType", clientProductType);
module.exports = {
    Client,
    Users,
    Role,
    UserInRole,
    ClientShops,
    Customer,
    ProductType,
    Order,
    OrderItem,
    OrderPayment,
    ClientProductType,
};
