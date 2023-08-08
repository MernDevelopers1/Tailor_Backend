const { Order, OrderItem, OrderPayment } = require("../db/Schema");

module.exports.AddOrder = async (req,res)=>{
    try{

    
    const {
        ClientId,
        CustomerId,
        ShopId,
        OrderPlacedDate,
        Status,
        OrderType,
        BillingFullName,
        BillingAddress,
        BillingCity,
        BillingState,
        BillingZip,
        BillingCountry,
        ShippingFullName,
        ShippingAddress,
        ShippingCity,
        ShippingState,
        ShippingZip,
        ShippingCountry,
        CompletedAt,
        AdditionalComments,
        OrderItems,
        PaymentAmount,
        PAdditionalComment,
      }=req.body;
        const Orderobj = new Order({ClientId,
            CustomerId,
            ShopId,
            OrderPlacedDate,
            Status,
            OrderType,
            BillingFullName,
            BillingAddress,
            BillingCity,
            BillingState,
            BillingZip,
            BillingCountry,
            ShippingFullName,
            ShippingAddress,
            ShippingCity,
            ShippingState,
            ShippingZip,
            ShippingCountry,
            CompletedAt,
            AdditionalComments});
            let orderdata = await Orderobj.save();
            OrderItems.forEach(item => {
                item.OrderId = orderdata._id;
              });
        const orderitemobj = await OrderItem.insertMany(OrderItems);
        const paymentobj = new OrderPayment({OrderId:orderdata._id,PaymentAmount,AdditionalComments:PAdditionalComment});
        const paymentdata = await paymentobj.save();
        orderdata = orderdata.toObject();
        orderdata.OrderItems = [...orderitemobj];
        orderdata = {...orderdata,PaymentAmount:paymentdata.PaymentAmount,PAdditionalComment:paymentdata.AdditionalComment};
        console.log(orderdata);
        res.status(200).send(orderdata);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    }
}