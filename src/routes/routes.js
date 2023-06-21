const express = require('express');
const { addClient, allClient } = require('../controllers/ClinetController');
const router = express.Router();
router.post("/Client",addClient);
router.get("/Client",allClient);



// router.get("/",(req,res)=>{
//     res.send("<h1>Hello World!</h1>");
// });



module.exports = router;