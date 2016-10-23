var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
    name: String,
    elo: Number
});

playerSchema.methods.rename = function (newName) {
    if (typeof newName === "string") {
        this.name = newName;
    } else {
        throw TypeError;
    }

};

playerSchema.methods.test = function () {
    console.log('name:' + this.name);
};

var Player = mongoose.model('Player', playerSchema);

module.exports = Player;