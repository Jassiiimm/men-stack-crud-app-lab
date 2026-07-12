const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const morgan = require("morgan")
const path = require("path")
const mongoose = require("mongoose")

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: false }))
app.use(morgan("dev"))

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

const VideoGame = require("./models/videoGame.js")

app.get("/", (req, res) => {
  res.render("home.ejs")
})

app.get("/games/new", (req, res) => {
  res.render("new.ejs")
})

app.post("/games", async (req, res) => {
  if (req.body.isCompleted === "on") {
    req.body.isCompleted = true
  } else {
    req.body.isCompleted = false
  }

  await VideoGame.create(req.body)

  res.redirect("/games/new")
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
})