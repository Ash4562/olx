const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("dist"));
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : process.env.LIVE_SERVER,
    credentials: true
}));

// Routes
app.use("/api/auth", require("./routers/authRoutes"));
app.use("*", (req, res) => {    
    res.status(404).json({ message: "Resource Not Found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: `Server Error: ${err.message}` });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED");
    app.listen(process.env.PORT, () => console.log(`SERVER RUNNING on port ${process.env.PORT}`));
});
