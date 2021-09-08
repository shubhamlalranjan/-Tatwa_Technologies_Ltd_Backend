require("dotenv").config();
const express = require("express");
const config = require("config");
const app = express();
require("express-async-errors");
const cors = require("cors");

//ROUTES
const userRoutes = require("./routes/user");

//CUSTOM MIDDLEWARES
const errorMiddleware = require("./middlewares/error");

// Here Config the CORS
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes For USER
app.use("/user", userRoutes);
app.use("/*", (req, res, next) => {
  return res
    .status(404)
    .send({ message: "We Don't have the route you are looking for ! " });
});
app.use(errorMiddleware);

const PORT = 9000 && config.get("PORT");

app.listen(PORT, () => {
  console.log(`We are Connected to the Server on ${PORT}`);
});
