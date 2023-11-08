const { default: mongoose } = require("mongoose");
const { ClientShops } = require("../db/Schema");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
module.exports.CheckUniqueStore = async (req, res) => {
  try {
    const { name, value } = req.body;
    if (name === "Username") {
      const Username = await ClientShops.find({ Username: value });
      if (Username.length) {
        console.log(name);

        res.status(409).json({ message: "Already Exist!" });
      } else {
        res.sendStatus(200);
      }
    } else {
      const Email = await ClientShops.find({ [name]: value });
      if (Email.length) {
        res.status(409).json({ message: "Already Exist!" });
      } else {
        res.sendStatus(200);
      }
    }
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};
module.exports.addStore = async (req, res) => {
  try {
    const {
      ClientId,
      StoreName,
      PrimaryContactName,
      PrimaryContactPhone,
      PrimaryContactEmail,
      Address,
      City,
      State,
      Zip,
      Country,
      Username,
      Password,
    } = req.body;
    const UsernameCheck = await ClientShops.find({
      $or: [{ Username }, { PrimaryContactEmail }],
    });
    if (!UsernameCheck.length) {
      const HashedPassword = await bcrypt.hash(Password, 10);
      const addStore = new ClientShops({
        ClientId,
        StoreName,
        PrimaryContactName,
        PrimaryContactPhone,
        PrimaryContactEmail,
        Address,
        City,
        State,
        Zip,
        Country,
        Username,
        Password: HashedPassword,
      });
      const result = await addStore.save();
      let data = result.toObject();
      delete data.Password;
      res.status(200).json(data);
    } else {
      if (UsernameCheck[0].Username === Username) {
        res.status(409).json({ message: "Username Already Exist!!" });
      } else {
        res
          .status(409)
          .json({ message: "Primary Contact Email Already Exist!!" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.getAllStores = async (req, res) => {
  try {
    const allStore = await ClientShops.find();
    const data = allStore.map((item) => {
      const temp = item.toObject();
      delete temp.Password;
      console.log(temp.password);
      return temp;
    });
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send(e);
  }
};
module.exports.getSpecificClientStores = async (req, res) => {
  try {
    // console.log(req.params);
    const { ClientId } = req.params;
    const { page, _id } = req.query;
    const page1 = page && page !== "undefined" ? parseInt(page) : 1;
    const skip = (page1 - 1) * 20;
    let fillter = {};
    let totalCount = 0;
    if (ClientId && ClientId !== "undefined") fillter.ClientId = ClientId;
    if (_id & (_id !== "undefined")) fillter._id = _id;
    if (page && page === "undefined") {
      totalCount = await ClientShops.countDocuments(fillter).exec();
      // console.log(totalCount);
    }
    const Stores = await ClientShops.find(fillter)
      .sort({
        _id: -1,
      })
      .skip(skip)
      .limit(20)
      .exec();
    const data = Stores.map((item) => {
      const temp = item.toObject();
      delete temp.Password;
      return temp;
    });
    // console.log(Stores);
    res.status(200).json({ data, totalCount });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.UpdateStores = async (req, res) => {
  try {
    const {
      _id,
      Password,
      ClientId,
      StoreName,
      PrimaryContactName,
      PrimaryContactPhone,
      PrimaryContactEmail,
      Address,
      City,
      State,
      Zip,
      Country,
      logedin,
    } = req.body;
    let HashedPassword = undefined;
    if (Password) {
      HashedPassword = await bcrypt.hash(Password, 10);
    }
    const updatedStore = await ClientShops.findByIdAndUpdate(
      _id,
      {
        $set: {
          Password: HashedPassword,
          ClientId,
          StoreName,
          PrimaryContactName,
          PrimaryContactPhone,
          PrimaryContactEmail,
          Address,
          City,
          State,
          Zip,
          Country,
        },
      },
      {
        new: true,
      }
    );
    if (logedin) {
      const Shops = await ClientShops.findById({ _id: updatedStore._id })
        .populate({
          path: "ClientId",
          select: "IsActive LogoUrl",
        })
        .exec();
      const data = Shops.toObject();
      delete data.Password;
      const token = jwt.sign({ ...data }, process.env.Token_key, {
        expiresIn: "1d",
      });
      res.status(200).send({ token });
    } else {
      let data = updatedStore.toObject();
      delete data.Password;
      res.status(200).json(data);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.DeleteStore = async (req, res) => {
  try {
    const { _id } = req.params;
    const DeletedStore = await ClientShops.deleteOne({ _id });
    res.status(200).json(DeletedStore);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.StoreLogin = async (req, res) => {
  try {
    const { Username, password } = req.body;
    if (password) {
      const Shops = await ClientShops.find({ Username }, null, {
        collation: { locale: "en", strength: 2 },
      })
        .populate({
          path: "ClientId",
          select: "IsActive LogoUrl",
        })
        .exec();
      if (Shops.length !== 0) {
        if (await bcrypt.compare(password, Shops[0].Password)) {
          console.log(Shops[0].IsActive);
          if (Shops[0].ClientId.IsActive && Shops[0].IsActive) {
            const data = Shops[0].toObject();
            delete data.Password;
            const token = jwt.sign({ ...data }, process.env.Token_key, {
              expiresIn: "1d",
            });
            res.status(200).send({ token });
          } else {
            Shops[0].ClientId.IsActive
              ? res.status(403).json({
                  message:
                    "The  store has been marked as inactive. Please reach out to the Client for additional support or assistance.",
                })
              : res.status(403).json({
                  message:
                    "The client's account of that store has been marked as inactive. Please reach out to the administrator for additional support or assistance.",
                });
          }
        } else {
          res.status(401).json({
            message:
              "The username or password you entered is incorrect. Please try again.",
          });
        }
      } else {
        res.status(401).json({
          message:
            "The username or password you entered is incorrect. Please try again.",
        });
      }
    } else {
      res.status(401).json({
        message:
          "The username or password you entered is incorrect. Please try again.",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.ChangeStorePassword = async (req, res) => {
  try {
    const { OldPassword, NewPassword } = req.body;
    const { _id } = req.params;
    const Shopdata = await ClientShops.findById({ _id });
    if (await bcrypt.compare(OldPassword, Shopdata.Password)) {
      const Password = await bcrypt.hash(NewPassword, 10);
      const Shop = await ClientShops.findByIdAndUpdate(
        { _id },
        {
          $set: { Password },
        },
        {
          new: true,
        }
      );
      if (Shop) {
        res
          .status(200)
          .json({ message: "Password has been successfully updated" });
      } else {
        res
          .status(404)
          .json({ message: "Shop not found or password update failed" });
      }
    } else {
      res.status(401).json({ message: "Old password provided is incorrect!!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.ChangeStoreActiveStatus = async (req, res) => {
  try {
    const { _id } = req.params;
    const { IsActive } = req.body;
    console.log(IsActive);
    console.log(_id);
    const changeStatus = await ClientShops.findByIdAndUpdate(
      { _id },
      { $set: { IsActive } },
      { new: true }
    );
    let data = changeStatus.toObject();
    console.log(data);
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
