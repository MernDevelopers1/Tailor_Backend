const { Order, OrderItem, OrderPayment } = require("../db/Schema");

module.exports.AddOrder = async (req, res) => {
  try {
    let {
      ClientId,
      CustomerId,
      ShopId,
      OrderPlacedDate,
      Status,
      OrderType,
      BillingFullName,
      BillingPhone,
      BillingEmail,
      BillingAddress,
      BillingCity,
      BillingState,
      BillingZip,
      BillingCountry,
      ShippingFullName,
      ShippingPhone,
      ShippingEmail,
      ShippingAddress,
      ShippingCity,
      ShippingState,
      ShippingZip,
      ShippingCountry,
      CompletedAt,
      AdditionalComments,
      OrderItems,
      ExpectedCompletionDate,
      PaymentAmount,
      PAdditionalComment,
      newpayments,
    } = req.body;
    // console.log("CompletedAt", CompletedAt);
    CompletedAt =
      (!CompletedAt || CompletedAt === "") && Status === "Completed"
        ? new Date()
        : CompletedAt !== null && Status !== "Completed"
        ? null
        : CompletedAt;
    const Orderobj = new Order({
      ClientId,
      CustomerId,
      ShopId,
      OrderPlacedDate,
      Status,
      OrderType,
      ExpectedCompletionDate,
      BillingFullName,
      BillingPhone,
      BillingEmail,
      BillingAddress,
      BillingCity,
      BillingState,
      BillingZip,
      BillingCountry,
      ShippingFullName,
      ShippingPhone,
      ShippingEmail,
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
      console.log("Item CompletedAt", item.CompletedAt);
      item.CompletedAt =
        (!item.CompletedAt || item.CompletedAt === "") &&
        item.ItemStatus === "Completed"
          ? new Date()
          : item.CompletedAt !== null && item.ItemStatus !== "Completed"
          ? null
          : item.CompletedAt;
    });
    const orderitemobj = await OrderItem.insertMany(OrderItems);
    let paymentdata = null;
    if (newpayments.length) {
      newpayments.forEach((item) => {
        item.OrderId = orderdata._id;
      });
      const paymentobj = await OrderPayment.insertMany(newpayments);
      console.log("Payments:");
      console.log(paymentobj);
    }
    orderdata = orderdata.toObject();
    orderdata = {
      ...orderdata,
      OrderItems: [...orderitemobj],
      PaymentHistory: [paymentdata ? paymentdata : null],
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

    if (StoreId && StoreId !== "null") {
      const orderdata = await Order.find({ ShopId: StoreId }).sort({
        _id: -1,
      });
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
    } else if (ClId) {
      const orderdata = await Order.find({ ClientId: ClId }).sort({
        _id: -1,
      });
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
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.UpdateOrder = async (req, res) => {
  try {
    let {
      _id,
      ClientId,
      CustomerId,
      ShopId,
      OrderPlacedDate,
      ExpectedCompletionDate,
      Status,
      OrderType,
      BillingFullName,
      BillingPhone,
      BillingEmail,
      BillingAddress,
      BillingCity,
      BillingState,
      BillingZip,
      BillingCountry,
      ShippingFullName,
      ShippingPhone,
      ShippingEmail,
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
      newpayments,
    } = req.body;
    // console.log("comp", CompletedAt);
    CompletedAt =
      (!CompletedAt || CompletedAt === "") && Status === "Completed"
        ? new Date()
        : CompletedAt !== null && Status !== "Completed"
        ? null
        : CompletedAt;
    let orderdata = await Order.findByIdAndUpdate(
      { _id },
      {
        $set: {
          ClientId,
          CustomerId,
          ShopId,
          OrderPlacedDate,
          ExpectedCompletionDate,
          Status,
          OrderType,
          BillingFullName,
          BillingPhone,
          BillingEmail,
          BillingAddress,
          BillingCity,
          BillingState,
          BillingZip,
          BillingCountry,
          ShippingFullName,
          ShippingPhone,
          ShippingEmail,
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
    let paymentdata = null;
    if (newpayments && newpayments.length) {
      newpayments.forEach((item) => {
        item.OrderId = orderdata._id;
      });
      const paymentobj = await OrderPayment.insertMany(newpayments);
      console.log("Payments:");
      console.log(paymentobj);
    }
    paymentdata = await OrderPayment.find({ OrderId: _id });
    const OrderItemsdata = await Promise.all(
      OrderItems.map(async (Element) => {
        Element.CompletedAt =
          (!Element.CompletedAt || Element.CompletedAt === "") &&
          Element.ItemStatus === "Completed"
            ? new Date()
            : Element.CompletedAt !== null && Element.ItemStatus !== "Completed"
            ? null
            : Element.CompletedAt;
        const id = Element._id;
        delete Element._id;
        const itemdata = await OrderItem.findOneAndUpdate(
          { OrderId: _id, _id: id },
          { $set: { ...Element } },
          { new: true }
        );
        if (itemdata) {
          return itemdata;
        } else {
          Element.OrderId = _id;
          const newitem = new OrderItem({ ...Element });
          const result = await newitem.save();
          return result;
        }
      })
    );
    orderdata = orderdata.toObject();
    orderdata.OrderItems = [...OrderItemsdata];
    orderdata = {
      ...orderdata,
      PaymentHistory: [...paymentdata],
    };
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
    orderdelete.orderdelete = {
      ...orderdelete,
      OrderItemsdelete: itemdelete,
      paymentdelete: paymentdelete,
    };
    console.log(orderdelete);
    res.status(200).send(orderdelete);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.AddPayment = async (req, res) => {
  try {
    const { OrderId, PaymentAmount, AdditionalComments } = req.body;
    const addpayment = new OrderPayment({
      OrderId,
      PaymentAmount,
      AdditionalComments,
    });
    const result = await addpayment.save();
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.UpdateOrderStatus = async (req, res) => {
  try {
    console.log(req.body);
    const { _id, Status, ItemStatus, id, paymentinfo } = req.body;
    if (Status) {
      let result = undefined;
      if (paymentinfo) {
        const OrderId = _id;
        const { PaymentAmount, AdditionalComments } = paymentinfo;
        const addpayment = new OrderPayment({
          OrderId,
          PaymentAmount,
          AdditionalComments,
        });
        result = await addpayment.save();
      }
      const CompletedAt = Status === "Completed" ? new Date() : null;
      const updatestatus = await Order.findOneAndUpdate(
        { _id },
        {
          $set: { Status, CompletedAt },
        },
        { new: true }
      );
      // console.log(updatestatus);
      res.status(200).send({ updatestatus, result });
    } else if (ItemStatus) {
      const CompletedAt = ItemStatus === "Completed" ? new Date() : null;
      const updatestatus = await OrderItem.findOneAndUpdate(
        { OrderId: _id, _id: id },
        {
          $set: { ItemStatus, CompletedAt },
        },
        { new: true }
      );
      console.log(updatestatus);
      res.status(200).send(updatestatus);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
