const bcrypt = require("bcrypt");
const { Users, Customer, UserInRole } = require("../db/Schema");
const { default: mongoose } = require("mongoose");
const useragent = require("useragent");

module.exports.addCustomer = async (req, res) => {
  try {
    const {
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
    const LastLoginAt = useragent.parse(req.headers['user-agent']).device.toString();
    
    if (Password) {
      const HashedPassword = await bcrypt.hash(Password, 10);
      const userdata = new Users({
        Username,
        HashedPassword,
        LastLoginFromIp,
        LastLoginAt,
      });
      let Result = await userdata.save();
      const CustomerData = new Customer({
        UserId: Result._id,
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
      Result = await CustomerData.save();
      const userInRole = new UserInRole({ UserId: Result.UserId, RoleId: 3 });
      await userInRole.save();
      // console.log(Result);
      res.status(200).send(Result);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.getAllCustomer = async (req,res) =>{
  try{

    const result = await Customer.find().populate("UserId","Username").exec();
    res.status(200).json(result);
  }catch(e){
    res.status(500).json(e);
  }
}
module.exports.getCustomer = async (req,res) =>{
  try{

    const {_id} = req.params;
    const result = await Customer.find({_id}).populate("UserId","Username").exec();
    res.status(200).json(result);
  }catch(e){
    res.status(500).json(e);
  }
}
module.exports.UpdateCustomer = async(req,res) =>{
  try{  
    const { 
      _id,  
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
    const updateCustomer = await Customer.findByIdAndUpdate({_id}, { $set: {  
      
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
    }});
    // res.status(200).json(updateCustomer);
    const updateUsername = await Users.findByIdAndUpdate({_id:updateCustomer.UserId},{$set:{
      LastLoginFromIp,
      LastLoginAt,
      Username}
    });
    res.status(200).json({updateCustomer,Username: updateUsername.Username});
  }catch(e){
    res.status(500).json(e);
  }
   
}
module.exports.DeleteCustomer = async (req,res) =>{
  try{

    // res.status(200).json(req.params);
    const {_id} = req.params;
    // console.log(_id);
    const id = new mongoose.Types.ObjectId(_id);
    const DeleteCustomer = await Customer.findByIdAndRemove({_id });
    const DeleteUser = await Users.deleteOne({_id:DeleteCustomer.UserId });
    const DeleteUserImRole = await UserInRole.deleteOne({UserId: id });
    if(DeleteCustomer && DeleteUser && DeleteUserImRole )
      res.status(200).json("Deleted Successfully!!");
  }catch(e){
    // console.log(e);
    res.status(500).send(e);
  }
}