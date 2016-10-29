var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Game = mongoose.model('Game');

// Get list of games
router.get('/', function(req, res, next) {
    console.log('get games');
    res.sendStatus(200)
});

router.post('/', function (req, res, next){
    var game = new Game(req.body)
    console.log('post game: ' + game.maxScore + ', ' + game.score1 + ', ' + game.score2);
    /*TODO: error handling
     * Find tournament and check if the scores fit
     * Also transmission of the match the games belongs to is missing
     */
    game.save().then(function(game) {
        console.log('Saving new game successfull');
        res.json(game)
    }, function(err) {
        console.log('An error occured while saving the new game');
    })
});

module.exports = router;
