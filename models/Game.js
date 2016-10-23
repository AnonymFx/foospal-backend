var mongoose = require("mongoose");

var GameSchema = new mongoose.Schema({
    maxScore: Number,
    score1: {type: Number, default: 0},
    score2: {type: Number, default: 0}
});

mongoose.model("Game", GameSchema);
