const express = require("express");
const cors = require("cors");
const {connection} = require("./db/conn");
const {Client, Customer, Role} = require("./db/Schema");
const router = require("./routes/routes");
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api",router);





app.get("/",async (req,res)=>{
    // const roles = [{RoleId:1,RoleName:"Admin"},{RoleId:1,RoleName:"Client"},{RoleId:1,RoleName:"Customer"}]
    // // const ClientData = new Client({Name:"Testing",Email:"Testing@testing@gmail.com",Phone_Number:"030000000"});
    // const Result = await Role.insertMany(roles);
    // res.status(200).json(Result);
})

const Port =  5000;
connection(()=>app.listen(Port,()=>{
    console.log("Server is Running!")
}));
