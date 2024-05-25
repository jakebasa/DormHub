const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes/router");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(router);

const PORT = 5001;

mongoose
  .connect("mongodb://localhost:27017/DormitoryDB")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to mongoDB", err);
  });

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
