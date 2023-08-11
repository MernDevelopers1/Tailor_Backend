const { default: mongoose } = require("mongoose");
const { Users, Client, UserInRole, ClientShops } = require("../db/Schema");
const useragent = require("useragent");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    const LogoUrl = "images/DefaultLogo.png";
    const CoverPhotoUrl = "images/DefaultCover.png";

    if (Password) {
      const HashedPassword = await bcrypt.hash(Password, 10);
      const userdata = new Users({
        Username,
        HashedPassword,
        LastLoginFromIp,
        LastLoginAt,
      });
      let Result = await userdata.save();
      const clientdata = new Client({
        UserID: Result._id,
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
      Result = await clientdata.save();
      const userInRole = new UserInRole({ UserId: Result.UserID, RoleId: 2 });
      await userInRole.save();
      res.status(200).send(Result);
    }
  } catch (e) {
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
    // console.log(req.params);
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
      Username,
      LastLoginFromIp,
      LastLoginAt,
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

    // console.log(req.body);
    const updateClient = await Client.findByIdAndUpdate(_id, {
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
    });
    // res.status(200).json(updateClient);
    const updateUsername = await Users.findByIdAndUpdate(
      { _id: updateClient.UserID },
      {
        $set: {
          LastLoginFromIp,
          LastLoginAt,
          Username,
        },
      }
    );
    res.status(200).json({ updateClient, Username: updateUsername.Username });
  } catch (e) {
    res.status(500).json(e);
  }
};
module.exports.DeleteClient = async (req, res) => {
  try {
    // res.status(200).json(req.params);
    const { _id } = req.params;
    const id = new mongoose.Types.ObjectId(_id);
    const DeleteClient = await Client.findByIdAndRemove({ _id });
    const DeleteUser = await Users.deleteOne({ _id: DeleteClient.UserID });
    const DeleteUserImRole = await UserInRole.deleteOne({ UserId: id });
    const DeleteStores = await ClientShops.deleteMany({ ClientId: id });
    if (DeleteClient && DeleteUser && DeleteUserImRole && DeleteStores)
      res.status(200).json("Deleted Successfully!!");
  } catch (e) {
    // console.log(e);
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
      // console.log(user[0]._id);
      if (await bcrypt.compare(password, user[0].HashedPassword)) {
        const userinrole = await UserInRole.find({ UserId: user[0]._id });
        // console.log(userinrole);
        if (Role === userinrole[0].RoleId) {
          const data = await Client.find({UserID:user[0]._id});
          await Users.findByIdAndUpdate({_id:user[0]._id},{
           $set:{LastLoginAt,LastLoginFromIp} 
          })
          
          const token = jwt.sign({ _id: data[0]._id }, process.env.Token_key, { expiresIn: '1d' });
           res.status(200).send({data:data[0],token});
        } else {
          res.status(403).send("invalid credentials!");
        }
      } else {
        res.status(403).send("invalid credentials!");
      }
    } else {
      res.status(403).send("invalid credentials!");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.Getloginclient = async (req,res) => {
  try{
      // console.log(req.query);
    const {token} = req.query;
    // console.log(token);
    // console.log(process.env.Token_key);
    const {_id} = jwt.verify(token,process.env.Token_key);
    // console.log(_id);
    const data = await Client.findById({_id});
    // console.log(data);
    res.status(200).send(data);
    
  }catch(e){
    console.log(e);
    res.status(500).send(e);
  }
}
