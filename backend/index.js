const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth");
const session = require("express-session");
const passportStrategy = require("./passport");
const mqtt = require("mqtt");
require("dotenv").config();

const MongoStore = require("connect-mongo");

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(
  session({
    secret: "mubashir",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_STR }),
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use("/auth", authRoutes);

let options = {
  host: "d25bcff68c4b4d639a0bc7adad7240f4.s2.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "Mubashir",
  password: "Mubbi@hivemq061",
};

let client = mqtt.connect(options);

client.on("connect", function () {
  console.log("Connected");
  client.subscribe("nodemcu/control");
});

client.on("error", function (error) {
  console.log(error);
});

client.on("message", function (topic, message) {
  console.log("Received message: ", topic, message.toString());
  if (message.toString() == "ON") {
    console.log("Turning LED ON");
  } else if (message.toString() == "OFF") {
    console.log("Turning LED OFF");
  }
});

app.post("/api/sendXY", (req, res) => {
  const { coordinates } = req.body;

  if (!coordinates || !Array.isArray(coordinates)) {
    return res.status(400).json({ error: "Invalid coordinates format" });
  }

  console.log(coordinates);

  // Assuming coordinates is an array of objects like [{ x: 1, y: 2 }, { x: 3, y: 4 }]
  coordinates.forEach((coord) => {
    sendCoordinates(coord);

  });

  return res.status(200).json({ success: true });
});

function sendCoordinates(command) {
  client.publish("nodemcu/control", JSON.stringify(command));
}

const Medical = require("./models/medical");

mongoose.set("strictQuery", false);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

// mongo db

app.get("/api/medical", async (req, res) => {
  console.log(await mongoose.connection.db.listCollections().toArray());
  const result = await Medical.find();
  res.send({ result });
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
