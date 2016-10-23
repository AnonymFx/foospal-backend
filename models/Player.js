var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
    name: String,
    elo: Number
});

playerSchema.methods.rename = function (newName) {
    this.name = newName;
    console.log('rename was called with name ' + newName);
};

playerSchema.methods.test = function () {
    console.log('test method start');
    console.log('name:' + this.name);
    console.log('test method end');
};

var Player = mongoose.model('Player', playerSchema);

module.exports = Player;