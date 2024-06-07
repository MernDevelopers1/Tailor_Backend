require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connection } = require("./db/conn");
const { Client, Customer, Role } = require("./db/Schema");
const router = require("./routes/routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(express.static("public"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server Error");
});

const Port = process.env.PORT || 5000;
connection(() =>
  app.listen(Port, () => {
    console.log(`Server is Running! ${Port}`);
  })
);
