require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mainRoute = require("./routes/router");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const connection = require("./db");

const app = express();
const PORT = 5001;
app.use(express.json());
app.use(cors());
app.use(mainRoute);
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

connection();

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
