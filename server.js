const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const morgan = require("morgan")
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override")

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: false }))
app.use(morgan("dev"))
app.use(methodOverride("_method"))

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

  res.redirect("/games")
})

app.get("/games", async (req, res) => {
  const allGames = await VideoGame.find()

  res.render("index.ejs", {
    allGames: allGames
  })
})

app.get("/games/:gameId", async (req, res) => {
  const foundGame = await VideoGame.findById(req.params.gameId)

  res.render("show.ejs", {
    foundGame: foundGame
  })
})

app.delete("/games/:gameId", async (req, res) => {
  await VideoGame.findByIdAndDelete(req.params.gameId)

  res.redirect("/games")
})

app.get("/games/:gameId/edit", async (req, res) => {
  const foundGame = await VideoGame.findById(req.params.gameId)

  res.render("edit.ejs", {
    foundGame: foundGame
  })
})

app.put("/games/:gameId", async (req, res) => {
  if (req.body.isCompleted === "on") {
    req.body.isCompleted = true
  } else {
    req.body.isCompleted = false
  }

  await VideoGame.findByIdAndUpdate(
    req.params.gameId,
    req.body
  )

  res.redirect(`/games/${req.params.gameId}`)
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
})