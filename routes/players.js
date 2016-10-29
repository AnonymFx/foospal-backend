var express = require('express')
var router = express.Router();

var mongoose = require('mongoose');
var Player = mongoose.model('Player');

router.post('/add', function(req, res, next) {
    var player = new Player(req.body);
    /* TODO: error handling */
    player.save().then(function(player) {
        console.log('Saving player successful: ID = ' + player._id +  ', Name = ' + player.name + ', ELO = ' + player.elo);
        res.json(player);
    }, function(err) {
        console.log('Could not save player '+ player.name);
        res.status(500)
    });
});

module.exports = router;
