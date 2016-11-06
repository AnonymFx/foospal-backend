var express = require('express')
var router = express.Router();

var mongoose = require('mongoose');
var Player = mongoose.model('Player');

router.post('/add', function (req, res, next) {
    var player = new Player(req.body);
    /* TODO: error handling */
    player.save().then(function (player) {
        console.log('POST: Saving player successful: ID = ' + player._id + ', Name = ' + player.name + ', ELO = ' + player.elo);
        res.json(player);
    }, function (err) {
        console.log('POST: Could not save player ' + player.name + '; error: ' + err);
        res.status(500);
        res.send();
    });
});

router.get('/:playerid', function (req, res, next) {
    var playerid = req.params.playerid;
    Player.findById(playerid, function (err, player) {
        if (err) {
            console.log('GET player by playerid failed: ' + err);
            res.status(500);
            res.send();
        }
        if (player === null) {
            res.status(404);
            res.send();
        } else {
            console.log('GET successful: returning player with id' + playerid);
            res.json(player);
        }
    });
});

router.delete('/:playerid', function (req, res, next) {
    var playerid = req.params.playerid;
    Player.findByIdAndRemove(playerid, function (err, player) {
        if (err) {
            console.log('DELETE player by playerid failed: ' + err);
            res.status(500);
            res.send();
        }
        if (player === null) {
            res.status(404);
            res.send();
        } else {
            console.log('DELETE successful:  player with id ' + playerid + ' deleted!');
            res.status(200);
            res.send();
        }
    });
});

module.exports = router;
