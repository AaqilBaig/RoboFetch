const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth");
const session = require("express-session");
require("dotenv").config();
require('./passport')

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "https://robofetch.onrender.com/"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(
  session({
    secret: "lmnopqrstuvwxyz",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use("/auth", authRoutes);



const Medical = require("./models/medical");

mongoose.set("strictQuery", false);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json("Hello world");
});

// mongo db

app.get("/api/medical", async (req, res) => {
  console.log(await mongoose.connection.db.listCollections().toArray());
  const result = await Medical.find();
  res.json(result);
});

app.get("/api/medical/:id", async (req, res) => {
  const { id: tabletId } = req.params;
  console.log(tabletId);
  try {
    const tablet = await Medical.findById(tabletId);
    console.log(tablet);
    if (!tablet) {
      res.status(400).json({ error: "Tablet not found" });
    }
    res.status(200).json({ tablet });
  } catch (error) {
    res.status(500).json({ error: "Kuch to gadbad hai daya" });
  }
});

app.post("/api/medical", async (req, res) => {
  // const { name, x, y } = await req.body;
  try {
    const medical = new Medical(req.body);
    await medical.save();
    res.status(201).json({ medical: medical });
    console.log(medical);
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
  // res.send(req.body)
});

app.put("/api/medical/:id", async (req, res) => {
  const { id: tabletId } = req.params;
  const result = await Medical.replaceOne({ _id: tabletId }, req.body);
  console.log(result);
  res.json({ updatedCount: result.modifiedCount });
});

app.delete("/api/medical/:id", async (req, res) => {
  try {
    const { id: tabletId } = req.params;
    const result = await Medical.deleteOne({ _id: tabletId });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_STR);
    app.listen(port, () => {
      console.log(`Server is listening on ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
