const express = require("express");
const {
  addClient,
  getClient,
  UpdateClient,
  DeleteClient,
  getAllClient,
  ClientLogin,
  Getloginclient,
  ChangeActiveStatus,
  ChangeProfile,
  ChangeCover,
  ChangePassword,
  UniqueCheck,
  getLogo,
} = require("../controllers/ClientController");
const {
  addStore,
  getAllStores,
  getSpecificClientStores,
  UpdateStores,
  DeleteStore,
  StoreLogin,
  ChangeStorePassword,
  ChangeStoreActiveStatus,
  CheckUniqueStore,
} = require("../controllers/StoreController");
const {
  addCustomer,
  getAllCustomer,
  getCustomer,
  UpdateCustomer,
  DeleteCustomer,
  verifyPhone,
} = require("../controllers/CustomerController");
const {
  addProduct,
  GetAllProduct,
  GetSpecificClientProduct,
  UpdateProduct,
  DeleteProduct,
  AddMoreAtt,
} = require("../controllers/ClientProductType");
const router = express.Router();
const { upload, uploadImage } = require("../controllers/ImageUpload");
const {
  AddOrder,
  GetOrders,
  UpdateOrder,
  DeleteOrder,
  AddPayment,
  UpdateOrderStatus,
} = require("../controllers/OrderController");
const {
  AddAdmin,
  AdminLogin,
  VerifyAdminLogin,
  ChangeAdminPassword,
} = require("../controllers/AdminController");
const {
  addDefaultProduct,
  GetAllDefaultProduct,
  UpdateDefaultProduct,
  DeleteDefaultProduct,
} = require("../controllers/DefaultProductType");
const {printApi} = require("../controllers/SomeOtherController");

router.post("/upload", uploadImage, upload);
//-----------------------Admin Routes Start------------------------------------
router.get("/Adminaddition", AddAdmin);
router.post("/Adminlogin", AdminLogin);
router.get("/AdminLogin", VerifyAdminLogin);
router.patch("/Adminpassword/:_id", ChangeAdminPassword);
//-----------------------Admin Routes End--------------------------------------
//-----------------------Client Routes Start-----------------------------------
router.post("/ClientUnique", UniqueCheck);
router.post("/Client", addClient);
router.post("/Clientlogin", ClientLogin);
router.get("/Clientlogo/:_id", getLogo);
router.get("/Clientlogin", Getloginclient);
router.get("/Client", getAllClient);
router.get("/Client/:_id", getClient);
router.patch("/Client", UpdateClient);
router.patch("/Client/:_id", ChangeActiveStatus);
router.patch("/Clientprofile/:_id", uploadImage, ChangeProfile);
router.patch("/Clientcover/:_id", uploadImage, ChangeCover);
router.patch("/Clientpassword/:_id", ChangePassword);
router.delete("/Client/:_id", DeleteClient);
//-----------------------Client Routes End-------------------------------------
//=======================Store Routes Start====================================
router.post("/StoreUnique", CheckUniqueStore);
router.post("/Store", addStore);
// router.get("/Store", getAllStores); //Not Impelemented on Frontend
router.get("/Store/:ClientId", getSpecificClientStores);
router.patch("/Store", UpdateStores);
router.patch("/Store/:_id", ChangeStoreActiveStatus);
router.patch("/Storepassword/:_id", ChangeStorePassword);
router.delete("/Store/:_id", DeleteStore);
router.post("/storelogin", StoreLogin);
//=======================Store Routes End======================================
//=======================Customer Routes Start=================================
router.post("/Customer", addCustomer);
router.post("/CustomerP", verifyPhone);
router.get("/Customer", getAllCustomer);
router.get("/Customer/:_id", getCustomer);
router.patch("/Customer", UpdateCustomer);
router.delete("/Customer/:_id", DeleteCustomer);
//=======================Customer Routes End===================================
//=======================Client Product Routes Start=================================
router.post("/ClientProduct", addProduct);
// router.get("/ClientProduct", GetAllProduct); //Not Impelemented on Frontend
router.get("/ClientProduct/:Client_id/:_id?", GetSpecificClientProduct);
router.patch("/ClientProduct", UpdateProduct);
router.patch("/ClientProduct/:_id", AddMoreAtt);
router.delete("/ClientProduct/:_id", DeleteProduct);
//=======================Client Product Routes End===================================
//=======================Default Product Routes Start=================================
router.post("/DefaultProduct", addDefaultProduct);
router.get("/DefaultProduct", GetAllDefaultProduct);
router.patch("/DefaultProduct", UpdateDefaultProduct);
router.delete("/DefaultProduct/:_id", DeleteDefaultProduct);
//=======================Default Product Routes End===================================
//=======================Order Routes==========================================
router.post("/Order", AddOrder);
router.get("/Order/:ClId/:StoreId", GetOrders);
router.patch("/Order", UpdateOrder);
router.delete("/Order/:_id", DeleteOrder);
router.post("/addpayment", AddPayment);
router.post("/Orderstatus", UpdateOrderStatus);
//=======================Order Routes End======================================
//=======================Some Other Api routes==========================================
router.get("/Print/:orderId",printApi)

//=======================Some Other Api routes End======================================
module.exports = router;
