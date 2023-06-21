const { default: mongoose } = require("mongoose");
const { Users, Client, UserInRole } = require("../db/Schema");
const bcrypt = require("bcrypt");

module.exports.addClient = async (req, res) => {
  try {
    const {
      Username,
      Password,
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
    } = req.body;
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
      const userInRole = new UserInRole({ UserId: Result._id, RoleId: 2 });
      await userInRole.save();
      res.status(200).send(Result);
    }
  } catch (e) {
    res.status(500).send(e);
  }
};
module.exports.allClient = async (req,res) =>{
  try{

    const result = await Client.find().populate("UserID","Username").exec();
    res.status(200).json(result);
  }catch(e){
    res.status(500).json(e);
  }
}
module.exports.getClient = async (req,res) =>{
  try{

    const {_id} = req.params;
    const result = await Client.find({_id}).populate("UserID","Username").exec();
    res.status(200).json(result);
  }catch(e){
    res.status(500).json(e);
  }
}
module.exports.UpdateClient = async(req,res) =>{
  try{  
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
    } = req.body;
    const updateClient = await Client.findByIdAndUpdate(_id, { $set: {  
      
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
    }});
    // res.status(200).json(updateClient);
    const updateUsername = await Users.findByIdAndUpdate({_id:updateClient.UserID},{$set:{
      LastLoginFromIp,
      LastLoginAt,
      Username}
    });
    res.status(200).json({updateClient,Username: updateUsername.Username});
  }catch(e){
    res.status(500).json(e);
  }
   
}
module.exports.DeleteClient = async (req,res) =>{
  try{

    // res.status(200).json(req.params);
    const {_id} = req.params;
    // res.json(_id);
    const DeleteClient = await UserInRole.deleteOne({ UserId:  });
    res.status(200).json(DeleteClient);
  }catch(e){
    res.status(500).json(e);
  }
}
