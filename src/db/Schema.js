const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const client = mongoose.Schema(
  {
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    BusinessName: {
      type: String,
      required: true,
    },
    BusinessEmail: {
      type: String,
      required: true,
      unique: true,
    },
    BusinessPhone: {
      type: String,
      required: true,
    },
    BusinessAddress: {
      type: String,
      required: true,
    },
    City: {
      type: String,
      required: true,
    },
    State: {
      type: String,
      required: true,
    },
    Zip: {
      type: String,
      required: true,
    },
    Country: {
      type: String,
      required: true,
    },
    PrimaryContactName: {
      type: String,
      required: true,
    },
    PrimaryContactEmail: {
      type: String,
      required: true,
      unique: true,
    },
    PrimaryContactPhone: {
      type: String,
      required: true,
    },
    LogoUrl: {
      type: String,
      // required: true,
    },
    CoverPhotoUrl: {
      type: String,
      // required: true,
    },
    IsActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
client.plugin(uniqueValidator);
const users = mongoose.Schema(
  {
    Username: {
      type: String,
      required: true,
      unique: true,
    },
    HashedPassword: {
      type: String,
      required: true,
    },
    LastLoginFromIp: {
      type: String,
      required: true,
    },
    LastLoginAt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
users.plugin(uniqueValidator);
const role = mongoose.Schema(
  {
    RoleId: {
      type: Number,
      required: true,
    },
    RoleName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const userInRole = mongoose.Schema(
  {
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    RoleId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const clientShops = mongoose.Schema(
  {
    ClientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clients",
      required: true,
    },
    Username: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    StoreName: {
      type: String,
      required: true,
    },
    PrimaryContactName: {
      type: String,
      required: true,
    },
    PrimaryContactPhone: {
      type: String,
      required: true,
    },
    PrimaryContactEmail: {
      type: String,
      required: true,
      unique: true,
    },
    Address: {
      type: String,
      required: true,
    },
    City: {
      type: String,
      required: true,
    },
    State: {
      type: String,
      required: true,
    },
    Zip: {
      type: String,
      required: true,
    },
    Country: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
clientShops.plugin(uniqueValidator);
const customers = mongoose.Schema(
  {
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    FullName: {
      type: String,
      required: true,
    },
    Phone1: {
      type: String,
      required: true,
    },
    Phone2: {
      type: String,
    },
    Email: {
      type: String,
      // required: true,
      unique: true,
      sparse: true,
      validate: {
        validator: function (value) {
          console.log(value);
          if (value === null || value === "null" || value === undefined) {
            console.log("True");
            return true;
          }
          return this.constructor
            .findOne({ Email: value })
            .then((existingDoc) => {
              console.log(existingDoc);
              return !existingDoc;
            });
        },
        message: "This value is not unique.",
      },
    },

    Address: {
      type: String,
      // required: true,
    },
    City: {
      type: String,
      // required: true,
    },
    State: {
      type: String,
      // required: true,
    },
    Zip: {
      type: String,
      // required: true,
    },
    Country: {
      type: String,
      // required: true,
    },
    IsActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
customers.plugin(uniqueValidator);
const productType = mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  ImageUrl: {
    type: String,
    required: true,
  },
  MeasurmentAttribute: {
    type: Array,
    required: true,
  },
  TypeId: {
    type: String,
    required: true,
  },
});
const clientProductType = mongoose.Schema({
  Client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients",
    required: true,
  },
  Title: {
    type: String,
    required: true,
  },
  ImageUrl: {
    type: String,
    required: true,
  },
  MeasurmentAttribute: {
    type: Array,
    required: true,
  },
  TypeId: {
    type: String,
    required: true,
  },
});
const order = mongoose.Schema(
  {
    ClientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clients",
      required: true,
    },
    CustomerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    ShopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientShop",
      required: true,
    },
    OrderPlacedDate: {
      type: Date,

      default: Date.now,
    },
    Status: {
      type: String,
      required: true,
    },
    OrderType: {
      type: String,
      required: true,
    },
    BillingFullName: {
      type: String,
      required: true,
    },
    BillingAddress: {
      type: String,
      required: true,
    },
    BillingCity: {
      type: String,
      required: true,
    },
    BillingState: {
      type: String,
      required: true,
    },
    BillingZip: {
      type: String,
      required: true,
    },
    BillingCountry: {
      type: String,
      required: true,
    },
    ShippingFullName: {
      type: String,
    },
    ShippingAddress: {
      type: String,
    },
    ShippingCity: {
      type: String,
    },
    ShippingState: {
      type: String,
    },
    ShippingZip: {
      type: String,
    },
    ShippingCountry: {
      type: String,
    },
    CompletedAt: {
      type: Date,
      default: null,
    },
    AdditionalComments: {
      type: String,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);
const orderItem = mongoose.Schema(
  {
    OrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    ProductTypeId: {
      type: String,
      required: true,
    },
    MeasurmentAttributeValues: {
      type: Object,
      required: true,
    },
    ItemCost: {
      type: Number,
      required: true,
    },
    ItemDiscount: {
      type: Number,
    },
    ItemSalesTax: {
      type: Number,
      required: true,
    },
    DeliveryPickupStatus: {
      type: String,
      required: true,
    },
    ItemStatus: {
      type: String,
      required: true,
    },
    TrialDate: {
      type: Date,
      required: true,
    },
    CompletedAt: {
      type: Date,
      default: null,
    },
    AdditionalComments: {
      type: String,
      // required: true,
    },
    ExpectedCompletionDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const orderPayment = mongoose.Schema(
  {
    OrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    PaymentAmount: {
      type: Number,
      required: true,
    },
    AdditionalComments: {
      type: String,
      // required:true,
    },
    PaymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const Client = mongoose.model("Clients", client);
const Users = mongoose.model("User", users);
const Role = mongoose.model("Role", role);
const UserInRole = mongoose.model("UserInRole", userInRole);
const ClientShops = mongoose.model("ClientShop", clientShops);
const Customer = mongoose.model("Customer", customers);
const ProductType = mongoose.model("ProductType", productType);
const Order = mongoose.model("Order", order);
const OrderItem = mongoose.model("OrderItem", orderItem);
const OrderPayment = mongoose.model("OrderPayment", orderPayment);
const ClientProductType = mongoose.model(
  "ClientProductType",
  clientProductType
);
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
