require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const accoutRoutes = require("./routes/account");
const NewOrderRoutes = require("./routes/newOrder");
const DesignRoutes = require("./routes/Design");
const CustomerRoutes = require("./routes/customer");
const OrderPaymentRoutes = require("./routes/OrderPayment");
const imageRoutes = require("./routes/pictures");
const itemROutes = require("./routes/item");
const app = express();
const path = require("path");

// Middleware
app.use(express.json()); // Parses JSON request bodies
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
})); // Enables CORS

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Routes
app.use("/user", accoutRoutes);
app.use("/order", NewOrderRoutes);
app.use("/design", DesignRoutes);
app.use("/customer", CustomerRoutes);
app.use("/orderPayment", OrderPaymentRoutes);
app.use("/item", itemROutes);
app.use("/gallery", imageRoutes);
// Dummy getConnection function (replace with your implementation)
const getConnection = () => {
    console.log("getConnection called");
};
getConnection();

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
};
app.use(errorHandler);

// Server Port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});