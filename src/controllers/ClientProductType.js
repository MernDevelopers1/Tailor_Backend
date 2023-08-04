const { default: mongoose } = require("mongoose");
const { ClientProductType } = require("../db/Schema");
const { compareSync } = require("bcrypt");

module.exports.addProduct = async (req,res) =>{
    try{
        // console.log("Called!");
        const {
            Client_id,
            Title,
            ImageUrl,
            MeasurmentAttribute,
            TypeId
        } = req.body;
        const addProduct = new ClientProductType({
            Client_id,
            Title,
            ImageUrl,
            MeasurmentAttribute,
            TypeId
        });

        const result = await addProduct.save();
        // console.log(result);
        res.status(200).json(result);

    }
    catch(e){
        console.log(e);
        res.status(500).send(e);
    };
}
module.exports.GetAllProduct = async(req,res) => {
    try{
        const AllProduct = await ClientProductType.find();
        res.status(200).json(AllProduct);
    }catch(e){
        res.status(500).send(e);
    }
};
module.exports.GetSpecificClientProduct = async(req,res) => {
    try{
        const {Client_id,_id} = req.params;
        const id = new mongoose.Types.ObjectId(Client_id);
        if(!_id){
            
            // console.log(id);

            const SpecificClientProduct = await ClientProductType.find({Client_id: id });
            res.status(200).json(SpecificClientProduct);
        }
        else{
            // console.log("Else Statment")
            const SpecificProduct = await ClientProductType.find({$and:[{_id},{Client_id: id }]});
            res.status(200).json(SpecificProduct);
        }
    }catch(e){

        console.log(e);
        res.status(500).send(e);
    }
};
module.exports.UpdateProduct = async (req,res) => {
    try{
        const {
            _id,
            Client_id,
            Title,
            ImageUrl,
            MeasurmentAttribute,
            TypeId
        } = req.body;
        const updateProduct = await ClientProductType.findByIdAndUpdate(_id,{$set:{
            Client_id,
            Title,
            ImageUrl,
            MeasurmentAttribute ,
            TypeId
        }
    });
    res.status(200).json(updateProduct);
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    }
};
module.exports.DeleteProduct = async(req,res) =>{
    try{
        const {_id} = req.params;
        const deletedProduct = await ClientProductType.findByIdAndRemove(_id);
        res.status(200).json(deletedProduct);
    }catch(e){
        res.status(500).sent(e);
    }
}