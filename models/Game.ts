var mongoose = require("mongoose");

var GameSchema = new mongoose.Schema({
    maxScore: number,
    score1: {type: number, default: 0},
    score2: {type: number, default: 0}
});

mongoose.model("Game", GameSchema);
