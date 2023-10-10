const { default: mongoose } = require("mongoose");
const {
  Users,
  Client,
  UserInRole,
  ClientShops,
  ProductType,
  ClientProductType,
} = require("../db/Schema");
const useragent = require("useragent");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
module.exports.UniqueCheck = async (req, res) => {
  try {
    const { name, value } = req.body;
    if (name === "Username") {
      const Username = await Users.find({ Username: value });
      if (Username.length) {
        console.log(name);

        res.status(409).json({ message: "Already Exist!" });
      } else {
        res.sendStatus(200);
      }
    } else {
      const Email = await Client.find({ [name]: value });
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

module.exports.addClient = async (req, res) => {
  try {
    const {
      Username,
      Password,

      BusinessName,
      BusinessEmail,
      BusinessPhone,
      BusinessAddress,
      City,
      State,
      Zip,
      Country,
      PrimaryContactName,
      PrimaryContactEmail,
      PrimaryContactPhone,
    } = req.body;
    const LastLoginFromIp = req.ip;
    const LastLoginAt = useragent
      .parse(req.headers["user-agent"])
      .device.toString();
    const LogoUrl = "";
    const CoverPhotoUrl = "";
    const UsernameCheck = await Users.find({ Username });
    if (UsernameCheck.length === 0) {
      const EmailCheck = await Client.find({
        $or: [{ BusinessEmail }, { PrimaryContactEmail }],
      });
      if (!EmailCheck.length) {
        if (Password) {
          const AllProduct = await ProductType.find();
          const HashedPassword = await bcrypt.hash(Password, 10);
          const userdata = new Users({
            Username,
            HashedPassword,
            LastLoginFromIp,
            LastLoginAt,
          });
          let Result1 = await userdata.save();
          const clientdata = new Client({
            UserID: Result1._id,
            BusinessName,
            BusinessEmail,
            BusinessPhone,
            BusinessAddress,
            City,
            State,
            Zip,
            Country,
            PrimaryContactName,
            PrimaryContactEmail,
            PrimaryContactPhone,
            LogoUrl,
            CoverPhotoUrl,
          });
          let Result = await clientdata.save();
          const userInRole = new UserInRole({
            UserId: Result.UserID,
            RoleId: 2,
          });
          await userInRole.save();
          const productdata = AllProduct.map((product) => {
            const tempprod = product.toObject();
            delete tempprod._id;
            return {
              Client_id: Result._id,
              ...tempprod,
            };
          });
          const data = await ClientProductType.insertMany(productdata);
          Result = Result.toObject();
          Result = {
            ...Result,
            UserID: { _id: Result1._id, Username: Result1.Username },
          };
          res.status(200).send(Result);
        } else {
          res.status(401).json({ message: "Password Is Undefind!!" });
        }
      } else {
        if (EmailCheck[0].BusinessEmail === BusinessEmail) {
          res.status(401).json({ message: "Business Email Already Exist!!" });
        } else {
          res
            .status(401)
            .json({ message: "Primary Contact Email Already Exist!!" });
        }
      }
    } else {
      res.status(401).json({ message: "Username Already Exist!!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.getAllClient = async (req, res) => {
  try {
    const result = await Client.find().populate("UserID", "Username").exec();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
};
module.exports.getClient = async (req, res) => {
  try {
    const { _id } = req.params;
    const result = await Client.find({ _id })
      .populate("UserID", "Username")
      .exec();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
};
module.exports.UpdateClient = async (req, res) => {
  try {
    const {
      _id,
      Password,
      BusinessName,
      BusinessEmail,
      BusinessPhone,
      BusinessAddress,
      City,
      State,
      Zip,
      Country,
      PrimaryContactName,
      PrimaryContactEmail,
      PrimaryContactPhone,
      LogoUrl,
      CoverPhotoUrl,
      UserID,
    } = req.body;

    let HashedPassword = undefined;
    let updateUsername = undefined;
    if (Password) {
      HashedPassword = await bcrypt.hash(Password, 10);
      updateUsername = await Users.findByIdAndUpdate(
        { _id: UserID },
        {
          $set: {
            HashedPassword,
          },
        },
        { new: true }
      );
    } else {
      updateUsername = await Users.findById({ _id: UserID });
    }
    const updateClient = await Client.findByIdAndUpdate(
      _id,
      {
        $set: {
          BusinessName,
          BusinessEmail,
          BusinessPhone,
          BusinessAddress,
          City,
          State,
          Zip,
          Country,
          PrimaryContactName,
          PrimaryContactEmail,
          PrimaryContactPhone,
          LogoUrl,
          CoverPhotoUrl,
        },
      },
      { new: true }
    );
    const Clientdata = updateClient.toObject();

    res.status(200).json({
      ...Clientdata,
      UserID: { _id: updateUsername._id, Username: updateUsername.Username },
    });
  } catch (e) {
    res.status(500).json(e);
  }
};
module.exports.DeleteClient = async (req, res) => {
  try {
    const { _id } = req.params;
    const id = new mongoose.Types.ObjectId(_id);
    const DeleteClient = await Client.findByIdAndRemove({ _id });
    const DeleteUser = await Users.deleteOne({ _id: DeleteClient.UserID });
    const DeleteUserImRole = await UserInRole.deleteOne({ UserId: id });
    const DeleteStores = await ClientShops.deleteMany({ ClientId: id });
    if (DeleteClient && DeleteUser && DeleteUserImRole && DeleteStores)
      res.status(200).json("Deleted Successfully!!");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.ClientLogin = async (req, res) => {
  try {
    const { Username, password, Role } = req.body;
    const LastLoginFromIp = req.ip;
    const LastLoginAt = useragent
      .parse(req.headers["user-agent"])
      .device.toString();
    if (password) {
      const user = await Users.find({ Username });
      if (user.length !== 0) {
        if (await bcrypt.compare(password, user[0].HashedPassword)) {
          const userinrole = await UserInRole.find({ UserId: user[0]._id });
          if (Role === userinrole[0].RoleId) {
            const data = await Client.find({ UserID: user[0]._id })
              .populate("UserID", "Username")
              .exec();
            if (data[0].IsActive) {
              await Users.findByIdAndUpdate(
                { _id: user[0]._id },
                {
                  $set: { LastLoginAt, LastLoginFromIp },
                }
              );

              const token = jwt.sign(
                { _id: data[0]._id },
                process.env.Token_key,
                { expiresIn: "1d" }
              );
              res.status(200).send({ data: data[0], token });
            } else {
              res.status(403).send({
                message:
                  "Your Account Is InActive  ( Please Contact Administator For Further Assistance )",
              });
            }
          } else {
            res.status(403).send({
              message:
                "The username or password you entered is incorrect. Please try again.",
            });
          }
        } else {
          res.status(403).send({
            message:
              "The username or password you entered is incorrect. Please try again.",
          });
        }
      } else {
        res.status(401).send({
          message:
            "The username or password you entered is incorrect. Please try again.",
        });
      }
    } else {
      res.status(403).send({
        message:
          "The username or password you entered is incorrect. Please try again.",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.Getloginclient = async (req, res) => {
  try {
    const { token } = req.query;
    const { _id } = jwt.verify(token, process.env.Token_key);
    const data = await Client.findById({ _id })
      .populate("UserID", "Username")
      .exec();
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.ChangeActiveStatus = async (req, res) => {
  try {
    const { _id } = req.params;
    const { IsActive } = req.body;
    const changeStatus = await Client.findByIdAndUpdate(
      { _id },
      { $set: { IsActive } },
      { new: true }
    );
    const userdata = await Users.find({ _id: changeStatus.UserID }, "Username");
    let data = changeStatus.toObject();
    data = { ...data, UserID: userdata[0] };
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.ChangeProfile = async (req, res) => {
  try {
    if (!req.error) {
      const { _id } = req.params;
      const { path: Imagepath } = req.file;
      const old = await Client.findById({ _id });
      if (old.LogoUrl && old.LogoUrl !== "" && old.LogoUrl !== Imagepath) {
        if (old.LogoUrl.includes("public")) {
          const filepath = path.join(__dirname, `../../${old.LogoUrl}`);
          fs.unlink(filepath, (err) => {
            if (err) {
              console.log(err);
              // res.status(500).send(err);
            } else {
              console.log(`File ${old.LogoUrl} has been deleted.`);
            }
          });
        } else {
          const filepath = path.join(__dirname, `../../public/${old.LogoUrl}`);
          fs.unlink(filepath, (err) => {
            if (err) {
              console.log(err);
              // res.status(500).send(err);
            } else {
              console.log(`File ${old.LogoUrl} has been deleted.`);
            }
          });
        }
      }
      const newdata = await Client.findByIdAndUpdate(
        { _id },
        {
          $set: { LogoUrl: Imagepath },
        },
        { new: true }
      );
      const Userdata = await Users.findById({ _id: newdata.UserID });
      let data = newdata.toObject();
      data = {
        ...data,
        UserID: { _id: Userdata._id, Username: Userdata.Username },
      };

      res.status(200).send(data);
    } else {
      res.status(req.error.status || 500).send(req.error);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
module.exports.ChangeCover = async (req, res) => {
  try {
    const { _id } = req.params;
    let { path: Imagepath } = req.file;
    const old = await Client.findById({ _id });
    if (
      old.CoverPhotoUrl &&
      old.CoverPhotoUrl !== "" &&
      old.CoverPhotoUrl !== Imagepath
    ) {
      const filepath = path.join(
        __dirname,
        `../../${old.CoverPhotoUrl.includes("public") ? "" : "public/"}${
          old.CoverPhotoUrl
        }`
      );
      fs.unlink(filepath, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send(err);
        } else {
          console.log(`File ${old.CoverPhotoUrl} has been deleted.`);
        }
      });
    }
    Imagepath = Imagepath.replace("images\\", "images/");
    const newdata = await Client.findByIdAndUpdate(
      { _id },
      {
        $set: { CoverPhotoUrl: Imagepath },
      },
      { new: true }
    );
    const Userdata = await Users.findById({ _id: newdata.UserID });
    let data = newdata.toObject();
    data = {
      ...data,
      UserID: { _id: Userdata._id, Username: Userdata.Username },
    };
    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};
module.exports.ChangePassword = async (req, res) => {
  try {
    const { OldPassword, NewPassword } = req.body;
    const { _id } = req.params;
    const Userdata = await Users.findById({ _id });
    if (await bcrypt.compare(OldPassword, Userdata.HashedPassword)) {
      const HashedPassword = await bcrypt.hash(NewPassword, 10);
      const User = await Users.findByIdAndUpdate(
        { _id },
        {
          $set: { HashedPassword },
        },
        {
          new: true,
        }
      );
      if (User) {
        res
          .status(200)
          .json({ message: "Password has been successfully updated" });
      } else {
        res
          .status(404)
          .json({ message: "User not found or password update failed" });
      }
    } else {
      res.status(401).json({ message: "Old password provided is incorrect!!" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
