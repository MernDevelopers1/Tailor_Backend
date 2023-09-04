const bcrypt = require("bcrypt");
const { Users, Customer, UserInRole, Order } = require("../db/Schema");
const { default: mongoose } = require("mongoose");
const useragent = require("useragent");

module.exports.addCustomer = async (req, res) => {
  try {
    let {
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

    if (!result.length) {
      Password = Password || "TailorCustomer1!";
      if (!Username) {
        x = 0;
        let defaultname = FullName.replace(/ /g, "");
        Username = defaultname;
        while (1) {
          console.log(Username);
          const data = await Users.find({ Username });
          if (!data.length) {
            break;
          }
          Username = `${defaultname}${++x}`;
        }
      }

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
        const userInRole = new UserInRole({ UserId: Result.UserId, RoleId: 3 });
        Result = Result.toObject();
        await userInRole.save();
        Result.UserId = { _id: Result1._id, Username: Result1.Username };
        // console.log(Result);
        res.status(200).send(Result);
      }
    } else {
      res.status(200).send(result);
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
    res.status(500).json(e);
  }
};
module.exports.getCustomer = async (req, res) => {
  try {
    const { _id } = req.params;
    const Orderdata = await Order.find({ ClientId: _id });
    let CustomerId = [];
    Orderdata.forEach((element) => {
      if (!CustomerId.includes(element.CustomerId)) {
        CustomerId.push(element.CustomerId);
      }
    });

    const result = await Customer.find({ _id: { $in: CustomerId } })
      .populate("UserId", "Username")
      .exec();
    res.status(200).json(result);
  } catch (e) {
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
    }else{
      updateUsername = await Users.findById({ _id: updateCustomer.UserId });
    }
    let data = updateCustomer.toObject();
    data.UserId = {
      _id: updateUsername._id,
      Username: updateUsername.Username,
    };
    res.status(200).json(data);
  } catch (e) {
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
      res.status(200).json("Deleted Successfully!!");
  } catch (e) {
    // console.log(e);
    res.status(500).send(e);
  }
};
