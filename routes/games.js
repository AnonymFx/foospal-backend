var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Game = mongoose.model('Game');

// Get list of games
router.post('/:gameId', function(req, res, next) {
    //TODO check game for validity (max score regarding tournament)
    var gameId = req.params.gameId;
    Game.findById(gameId).exec()
        .then(function(game) {
            console.log("update game");
        })
        .catch(function(error) {
            console.log("error while updating game");
        });
    console.log('get games');
    res.sendStatus(200);
});

router.put('/', function (req, res, next){
    var game = new Game(req.body);
    /*TODO: error handling
     * Find tournament and check if the scores fit
     * Also transmission of the match the games belongs to is missing
     */
    game.save().then(function(game) {
        console.log('Saving new game successfull');
        res.json(game);
    }).catch(function(err) {
        console.log('An error occured while saving the new game');
        res.status(500);
    });
});

module.exports = router;
