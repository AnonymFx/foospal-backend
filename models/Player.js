var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
    name: String,
    elo: Number
});

playerSchema.methods.rename = function (newName) {
    this.name = newName;
};

var Player = mongoose.model('Player', playerSchema);

module.exports = Player;