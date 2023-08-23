const { default: mongoose } = require("mongoose");
const { ClientShops } = require("../db/Schema");

const bcrypt = require("bcrypt");
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
    delete result.Password;
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.getAllStores = async (req, res) => {
  try {
    const allStore = await ClientShops.find();
    res.status(200).send(allStore);
  } catch (e) {
    res.status(500).send(e);
  }
};
module.exports.getSpecificClientStores = async (req, res) => {
  try {
    // console.log(req.params);
    const { _id } = req.params;

    const id = new mongoose.Types.ObjectId(_id);

    const Stores = await ClientShops.find({ ClientId: _id });
    // console.log(Stores);
    res.status(200).send(Stores);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.UpdateStores = async (req, res) => {
  try {
    const {
      _id,
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
    } = req.body;
    const updatedStore = await ClientShops.findByIdAndUpdate(_id, {
      $set: {
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
    });
    res.status(200).json(updatedStore);
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
