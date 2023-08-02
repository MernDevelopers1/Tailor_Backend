require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {connection} = require("./db/conn");
const {Client, Customer, Role} = require("./db/Schema");
const router = require("./routes/routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api",router);
app.use(express.static('public'));






// app.get('/', (req, res) => {
//     const clientIP = req.ip;
//     const userAgentHeader = req.headers['user-agent'];
//     console.log('User-Agent Header:', userAgentHeader);
  
//     const userAgent = useragent.parse(userAgentHeader);
//     console.log('User-Agent:', userAgent);
  
//     const device = userAgent.device.toString();
//     console.log('Device:', device);
  
//     res.send(`Client IP: ${clientIP}, Device: ${device}`);
//   });
  

const Port =  5000;
connection(()=>app.listen(Port,()=>{
    console.log("Server is Running!")
}));
