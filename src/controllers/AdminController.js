const useragent = require("useragent");
const { Users, UserInRole } = require("../db/Schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.AddAdmin = async (req, res) => {
  try {
    const Username = "Admin";
    const Password = "Tailor123!";
    const LastLoginAt = "Mobile";
    const LastLoginFromIp = "192.168.0.1";
    const HashedPassword = await bcrypt.hash(Password, 10);
    const Admin = new Users({
      Username,
      HashedPassword,
      LastLoginAt,
      LastLoginFromIp,
    });
    const result = await Admin.save();
    const Userinrole = new UserInRole({ UserId: result._id, RoleId: 1 });
    await Userinrole.save();
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e);
  }
};
module.exports.AdminLogin = async (req, res) => {
  try {
    const { Username, password, Role } = req.body;
    const LastLoginFromIp = req.ip;
    const LastLoginAt = useragent
      .parse(req.headers["user-agent"])
      .device.toString();
    if (password) {
      const user = await Users.find({ Username }, null, {
        collation: { locale: "en", strength: 2 },
      });
      // console.log(user[0]._id);
      if (user.length !== 0) {
        if (await bcrypt.compare(password, user[0].HashedPassword)) {
          const userinrole = await UserInRole.find({ UserId: user[0]._id });
          // console.log(userinrole);
          if (Role === userinrole[0].RoleId) {
            await Users.findByIdAndUpdate(
              { _id: user[0]._id },
              {
                $set: { LastLoginAt, LastLoginFromIp },
              }
            );

            const token = jwt.sign(
              { _id: user[0]._id },
              process.env.Token_key,
              { expiresIn: "1d" }
            );
            res.status(200).send({ message: "Logged In!", token });
          } else {
            res.status(403).json({
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
module.exports.VerifyAdminLogin = async (req, res) => {
  try {
    // console.log(req.query);
    const { token } = req.query;
    // console.log(token);
    // console.log(process.env.Token_key);
    const { _id } = jwt.verify(token, process.env.Token_key);
    // console.log(_id);
    if (_id) {
      res.status(200).send({ message: "Logged In!" });
    } else {
      res
        .status(403)
        .json({ message: "Token is not Valid! (plzz Login Again.)" });
    }
    // console.log(data);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.ChangeAdminPassword = async (req, res) => {
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
