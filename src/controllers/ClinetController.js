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
    const result = await Client.find();
    res.status(200).json(result);
}
