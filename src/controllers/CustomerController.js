const bcrypt = require("bcrypt");
const {
  Users,
  Customer,
  UserInRole,
  Order,
  ClientCustomers,
} = require("../db/Schema");
const { default: mongoose } = require("mongoose");
const useragent = require("useragent");

module.exports.addCustomer = async (req, res) => {
  try {
    let {
      ClientId,
      Username,
      Password,
      FullName,
      Phone1,
      Phone2,
      Email,
      Address,
      City,
      State,
      Zip,
      Country,
    } = req.body;
    const LastLoginFromIp = req.ip;
    const LastLoginAt = useragent
      .parse(req.headers["user-agent"])
      .device.toString();

    const result = await Customer.find({ Phone1 })
      .populate("UserId", "Username")
      .exec();
    ClientId = new mongoose.Types.ObjectId(ClientId);
    const clientcustomer = await ClientCustomers.findOne({ ClientId });
    if (!result.length) {
      Password = Password || "TailorCustomer1!";
      Username = Phone1;

      if (Password) {
        const HashedPassword = await bcrypt.hash(Password, 10);
        const userdata = new Users({
          Username,
          HashedPassword,
          LastLoginFromIp,
          LastLoginAt,
        });
        let Result1 = await userdata.save();
        const CustomerData = new Customer({
          UserId: Result1._id,
          FullName,
          Phone1,
          Phone2,
          Email,
          Address,
          City,
          State,
          Zip,
          Country,
        });
        let Result = await CustomerData.save();
        if (clientcustomer && Object.keys(clientcustomer).length) {
          await ClientCustomers.findOneAndUpdate(
            { ClientId },
            {
              $push: { CustomerIds: Result._id },
            }
          );
        } else {
          const newclietcustomer = new ClientCustomers({
            ClientId,
            CustomerIds: [Result._id],
          });
          await newclietcustomer.save();
        }
        const userInRole = new UserInRole({ UserId: Result.UserId, RoleId: 3 });
        await userInRole.save();
        Result = Result.toObject();
        Result.UserId = { _id: Result1._id, Username: Result1.Username };
        res.status(200).send(Result);
      }
    } else {
      if (clientcustomer && Object.keys(clientcustomer).length) {
        await ClientCustomers.findOneAndUpdate(
          { ClientId },
          {
            $addToSet: { CustomerIds: result[0]._id },
          }
        );
      } else {
        const newclietcustomer = new ClientCustomers({
          ClientId,
          CustomerIds: [result[0]._id],
        });
        await newclietcustomer.save();
      }
      const data = result[0].toObject();
      res
        .status(200)
        .send({ ...data, messsage: "Phone Number Already Registred!!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.getAllCustomer = async (req, res) => {
  try {
    const result = await Customer.find().populate("UserId", "Username").exec();
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
module.exports.getCustomer = async (req, res) => {
  try {
    const { _id } = req.params;
    const { page, ClientId } = req.query;
    const page1 = page && page !== "undefined" ? parseInt(page) : 1;
    const skip = (page1 - 1) * 20;
    let totalCount = 0;
    let result = null;
    if (ClientId && ClientId !== "undefined") {
      const ClientCustomerdata = await ClientCustomers.find({
        ClientId,
      });
      let CustomerId = [...ClientCustomerdata[0].CustomerIds];
      if (page && page === "undefined") totalCount = CustomerId.length;
      result = await Customer.find({ _id: { $in: CustomerId } })
        .populate("UserId", "Username")
        .sort({
          _id: -1,
        })
        .skip(skip)
        .limit(20)
        .exec();
    } else {
      result = await Customer.find({ _id })
        .populate("UserId", "Username")

        .exec();
    }
    res.status(200).json({ data: result, totalCount });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
module.exports.UpdateCustomer = async (req, res) => {
  try {
    const {
      _id,
      Password,
      Username,
      LastLoginFromIp,
      LastLoginAt,
      FullName,
      Phone1,
      Phone2,
      Email,
      Address,
      City,
      State,
      Zip,
      Country,
      IsActive,
    } = req.body;
    const updateCustomer = await Customer.findByIdAndUpdate(
      { _id },
      {
        $set: {
          FullName,
          Phone1,
          Phone2,
          Email,
          Address,
          City,
          State,
          Zip,
          Country,
          IsActive,
        },
      },
      {
        new: true,
      }
    );
    // res.status(200).json(updateCustomer);
    let updateUsername = undefined;
    if (Password) {
      const HashedPassword = await bcrypt.hash(Password, 10);
      updateUsername = await Users.findByIdAndUpdate(
        { _id: updateCustomer.UserId },
        {
          $set: {
            LastLoginFromIp,
            LastLoginAt,
            Username,
            HashedPassword,
          },
        },
        {
          new: true,
        }
      );
    } else {
      updateUsername = await Users.findById({ _id: updateCustomer.UserId });
    }
    let data = updateCustomer.toObject();
    data.UserId = {
      _id: updateUsername._id,
      Username: updateUsername.Username,
    };
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
module.exports.DeleteCustomer = async (req, res) => {
  try {
    // res.status(200).json(req.params);
    const { _id } = req.params;
    // console.log(_id);
    const id = new mongoose.Types.ObjectId(_id);
    const DeleteCustomer = await Customer.findByIdAndRemove({ _id });
    const DeleteUser = await Users.deleteOne({ _id: DeleteCustomer.UserId });
    const DeleteUserImRole = await UserInRole.deleteOne({ UserId: id });
    if (DeleteCustomer && DeleteUser && DeleteUserImRole)
      res.status(200).json({ messsage: "Deleted Successfully!!" });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.verifyPhone = async (req, res) => {
  try {
    const { Phone1 } = req.body;
    const result = await Customer.find({ Phone1 });
    if (result.length) {
      res.status(409).send({ messsage: "Already Exist!!" });
    } else {
      res.status(200).send({ message: "Not exist!!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
