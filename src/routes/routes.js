const express = require('express');
const { addClient,  getClient, UpdateClient, DeleteClient,  getAllClient } = require('../controllers/ClientController');
const router = express.Router();
//-----------------------Client Routes-----------------------------------
router.post("/Client",addClient);
router.get("/Client",getAllClient);
router.get("/Client/:_id",getClient);
router.patch("/Client",UpdateClient);
router.delete("/Client/:_id",DeleteClient);



// router.get("/",(req,res)=>{
//     res.send("<h1>Hello World!</h1>");
// });



module.exports = router;