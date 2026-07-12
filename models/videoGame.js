const mongoose = require("mongoose")

const videoGameSchema = new mongoose.Schema({
  title: String,
  platform: String,
  genre: String,
  isCompleted: Boolean
})

const VideoGame = mongoose.model("VideoGame", videoGameSchema)

module.exports = VideoGame