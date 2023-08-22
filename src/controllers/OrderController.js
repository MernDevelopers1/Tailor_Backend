const { Order, OrderItem, OrderPayment } = require("../db/Schema");

module.exports.AddOrder = async (req, res) => {
  try {
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
    } = req.body;
    const Orderobj = new Order({
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
    });
    let orderdata = await Orderobj.save();
    OrderItems.forEach((item) => {
      item.OrderId = orderdata._id;
    });
    const orderitemobj = await OrderItem.insertMany(OrderItems);
    let paymentdata = null;
    if(PaymentAmount){

      const paymentobj = new OrderPayment({
        OrderId: orderdata._id,
        PaymentAmount,
        AdditionalComments: PAdditionalComment,
      });
     paymentdata = await paymentobj.save();
    }
    orderdata = orderdata.toObject();
    orderdata = {
      ...orderdata,
      OrderItems: [...orderitemobj],
     PaymentHistory:[paymentdata?paymentdata:null]
    };
    console.log(orderdata);
    res.status(200).send(orderdata);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.GetOrders = async (req, res) => {
  // console.log(req.params);
  try {
    const { ClId, StoreId } = req.params;
   
    if (StoreId!=="null" ) {
        
      const orderdata = await Order.find({ ShopId: StoreId }).sort({ OrderPlacedDate: -1 });
      const orderIds = orderdata.map((obj) => obj._id);
      // console.log(orderIds);
      const orderitemdata = await OrderItem.find({
        OrderId: { $in: orderIds },
      });
      const orderPaymentdata = await OrderPayment.find({
        OrderId: { $in: orderIds },
      });
      const data = orderdata.map((order) => {
        // console.log(orderitemdata);
        const tempOI = orderitemdata.filter((item) =>
          item.OrderId.equals(order._id)
        );
        const tempOP = orderPaymentdata.filter((item) =>
          item.OrderId.equals(order._id)
        );
        // console.log(tempOI);
        // orderdata = orderdata.toObject();
        const newOrderData = {
          ...order.toObject(), // Convert Mongoose document to plain object
          OrderItems: [...tempOI],
          PaymentHistory: [...tempOP],
        };

        return newOrderData;
      });
      res.status(200).send(data);
    }else if(ClId){
        const orderdata = await Order.find({ ClientId: ClId }).sort({ OrderPlacedDate: -1 });
        const orderIds = orderdata.map((obj) => obj._id);
        // console.log(orderIds);
        const orderitemdata = await OrderItem.find({
          OrderId: { $in: orderIds },
        })
        const orderPaymentdata = await OrderPayment.find({
          OrderId: { $in: orderIds },
        });
        const data = orderdata.map((order) => {
          // console.log(orderitemdata);
          const tempOI = orderitemdata.filter((item) =>
            item.OrderId.equals(order._id)
          );
          const tempOP = orderPaymentdata.filter((item) =>
            item.OrderId.equals(order._id)
          );
          // console.log(tempOI);
          // orderdata = orderdata.toObject();
          const newOrderData = {
            ...order.toObject(), // Convert Mongoose document to plain object
            OrderItems: [...tempOI],
            PaymentHistory: [...tempOP],
          };
  
          return newOrderData;
        });
        res.status(200).send(data);

    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.UpdateOrder = async (req, res) => {
  try {
    const {
      _id,
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
    } = req.body;

    let orderdata = await Order.findByIdAndUpdate(
      { _id },
      {
        $set: {
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
        },
      },
      { new: true }
    );
    const paymentdata = await OrderPayment.findOneAndUpdate(
      { OrderId: _id },
      { $set: { PaymentAmount, PAdditionalComment } },
      { new: true }
    );
    const OrderItemsdata = await Promise.all(
      OrderItems.map(async (Element) => {
        const id = Element._id;
        delete Element._id;
        const itemdata = await OrderItem.findOneAndUpdate(
          { OrderId: _id, _id: id },
          { $set: { ...Element } },
          { new: true }
        );
        return itemdata;
      })
    );
    orderdata = orderdata.toObject();
    orderdata.OrderItems = [...OrderItemsdata];
    orderdata = {
      ...orderdata,
      PaymentAmount: paymentdata.PaymentAmount,
      PAdditionalComment: paymentdata.AdditionalComment,
    };
    console.log(orderdata);
    res.status(200).send(orderdata);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.DeleteOrder = async (req, res) => {
  try {
    const { _id } = req.params;

    let orderdelete = await Order.findOneAndDelete({ _id });
    const paymentdelete = await OrderPayment.deleteMany({ OrderId: _id });

    const itemdelete = await OrderItem.deleteMany({ OrderId: _id });

    orderdelete = orderdelete.toObject();
    orderdelete.
    orderdelete = {
      ...orderdelete,
      OrderItemsdelete : itemdelete,
      paymentdelete:paymentdelete,
      
    };
    console.log(orderdelete);
    res.status(200).send(orderdelete);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.AddPayment = async (req,res) => {
  try{

    const {OrderId,PaymentAmount,AdditionalComments} = req.body;
    const addpayment = new OrderPayment({OrderId,PaymentAmount,AdditionalComments});
    const result = await addpayment.save();
    res.status(200).send(result);
  }catch(e){
    console.log(e);
    res.status(500).send(e);
  }
}
module.exports.UpdateOrderStatus = async (req,res) =>{
  try{
    const {_id,Status,ItemStatus}= req.body;
    if(Status){

      const CompletedAt = Status==="Completed"? new Date():undefined
      const updatestatus = await Order.findOneAndUpdate({_id},{
        $set:{Status,CompletedAt}
      },{new:true});
      console.log(updatestatus)
      res.status(200).send(updatestatus);
      
    }else if(ItemStatus){
      const CompletedAt = ItemStatus==="Completed"? new Date():undefined
      const updatestatus = await OrderItem.findOneAndUpdate({OrderId:_id},{
        $set:{ItemStatus,CompletedAt}
      },{new:true});
      console.log(updatestatus);
      res.status(200).send(updatestatus);

    }

  }catch(e){
    console.log(e);
    res.status(500).send(e);
  }
}
