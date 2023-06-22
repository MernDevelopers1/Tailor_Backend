const express = require('express');
const { addClient,  getClient, UpdateClient, DeleteClient,  getAllClient } = require('../controllers/ClientController');
const { addStore, getAllStores, getSpecificClientStores, UpdateStores, DeleteStore } = require('../controllers/StoreController');
const router = express.Router();
//-----------------------Client Routes Start-----------------------------------
router.post("/Client",addClient);
router.get("/Client",getAllClient);
router.get("/Client/:_id",getClient);
router.patch("/Client",UpdateClient);
router.delete("/Client/:_id",DeleteClient);
//-----------------------Client Routes End-------------------------------------
//=======================Store Routes Start====================================
router.post("/Store",addStore);
router.get("/Store",getAllStores);
router.get("/Store/:_id",getSpecificClientStores);
router.patch("/Store",UpdateStores);
router.delete("/Store/:_id",DeleteStore);
//=======================Store Routes End======================================


// router.get("/",(req,res)=>{
//     res.send("<h1>Hello World!</h1>");
// });



module.exports = router;