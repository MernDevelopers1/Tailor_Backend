const express = require('express');
const { addClient,  getClient, UpdateClient, DeleteClient,  getAllClient, ClientLogin, Getloginclient } = require('../controllers/ClientController');
const { addStore, getAllStores, getSpecificClientStores, UpdateStores, DeleteStore } = require('../controllers/StoreController');
const { addCustomer, getAllCustomer, getCustomer, UpdateCustomer, DeleteCustomer } = require('../controllers/CustomerController');
const { addProduct, GetAllProduct, GetSpecificClientProduct, UpdateProduct, DeleteProduct } = require('../controllers/ClientProductType');
const router = express.Router();
const {upload,uploadImage} = require("../controllers/ImageUpload");
const { AddOrder, GetOrders, UpdateOrder, DeleteOrder, AddPayment, UpdateOrderStatus } = require('../controllers/OrderController');

router.post('/upload', uploadImage, upload);
//-----------------------Client Routes Start-----------------------------------
router.post("/Client",addClient);
router.post("/Clientlogin",ClientLogin)
router.get("/Clientlogin",Getloginclient)
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
//=======================Customer Routes Start=================================
router.post("/Customer",addCustomer);
router.get("/Customer",getAllCustomer);
router.get("/Customer/:_id",getCustomer);
router.patch("/Customer",UpdateCustomer);
router.delete("/Customer/:_id",DeleteCustomer);
//=======================Customer Routes End===================================
//=======================Client Product Routes Start=================================
router.post("/ClientProduct",addProduct);
router.get("/ClientProduct",GetAllProduct);
router.get("/ClientProduct/:Client_id/:_id?",GetSpecificClientProduct);
router.patch("/ClientProduct",UpdateProduct);
router.delete("/ClientProduct/:_id",DeleteProduct);
//=======================Client Product Routes End===================================
//=======================Order Routes==========================================
router.post("/Order",AddOrder);
router.get("/Order/:ClId/:StoreId",GetOrders);
router.patch("/Order",UpdateOrder);
router.delete("/Order/:_id",DeleteOrder);
router.post("/addpayment",AddPayment);
router.post("/Orderstatus",UpdateOrderStatus);
//=======================Order Routes End======================================
module.exports = router;