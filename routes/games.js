var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Game = mongoose.model('Game');

// Get list of games
router.post('/:gameId', function(req, res, next) {
    var gameId = req.params.gameId;
    console.log(req.body);
    var newGame = new Game(req.body);
    Game.findById(gameId).exec()
        .then(function(game) {
            // TODO: is this doable in a nicer way?
            if (newGame.maxScore && newGame.maxScore != game.maxScore) {
                console.log("updating max score");
                game.maxScore = newGame.maxScore;
            } else if (newGame.socre1 && newGame.score1 != game.score1) {
                console.log("updating score1");
                game.score1 = newGame.score1;
            } else if (newGame.score2 && newGame.socre2 != game.score2) {
                console.log("updating score2");
                game.score2 = newGame.score2;
            }
            console.log(game);
        })
        .catch(function(error) {
            console.log("error while updating game");
        });
    console.log('get games');
    res.sendStatus(200);
});

router.put('/', function(req, res, next) {
    console.log(req.body);
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
