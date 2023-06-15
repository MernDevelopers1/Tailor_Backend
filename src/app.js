const express = require("express");
const cors = require("cors");
const {connection} = require("./db/conn");
const {Client} = require("./db/Schema");
const app = express();

app.use(express.json());
app.use(cors());
// app.get("/",async (req,res)=>{
//     const ClientData = new Client({Name:"Testing",Email:"Testing@testing@gmail.com",Phone_Number:"030000000"});
//     const Result = await ClientData.save();
//     res.status(200).json(Result);
// })

const Port =  5000;
connection(()=>app.listen(Port,()=>{
    console.log("Server is Running!")
}));
