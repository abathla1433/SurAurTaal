const express=require("express");
const app = express();
const cookieParser=require("cookie-parser");
require("dotenv").config;
const connectDB=require("./db/db");

app.use(express.json());
app.use(cookieParser());

const authRoutes=require("./routes/auth.routes");
const musicRoutes=require("./routes/music.routes");
app.use("/api/auth",authRoutes);
app.use("/api/music",musicRoutes);

connectDB();


module.exports=app;