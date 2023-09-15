const { default: mongoose } = require("mongoose");
const { ProductType } = require("../db/Schema");
const { compareSync } = require("bcrypt");

module.exports.addDefaultProduct = async (req, res) => {
  try {
    const { Title, ImageUrl, MeasurmentAttribute, TypeId } = req.body;
    const addProduct = new ProductType({
      Title,
      ImageUrl,
      MeasurmentAttribute,
      TypeId,
    });

    const result = await addProduct.save();
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.GetAllDefaultProduct = async (req, res) => {
  try {
    const AllProduct = await ProductType.find();
    res.status(200).json(AllProduct);
  } catch (e) {
    res.status(500).send(e);
  }
};
module.exports.UpdateDefaultProduct = async (req, res) => {
  try {
    const { _id, Title, ImageUrl, MeasurmentAttribute, TypeId } = req.body;
    const updateProduct = await ProductType.findByIdAndUpdate(
      _id,
      {
        $set: {
          Title,
          ImageUrl,
          MeasurmentAttribute,
          TypeId,
        },
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
module.exports.DeleteDefaultProduct = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedProduct = await ProductType.findByIdAndRemove(_id);
    res.status(200).json(deletedProduct);
  } catch (e) {
    res.status(500).sent(e);
  }
};
