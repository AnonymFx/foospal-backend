var express = require('express');
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

router.post('/:playerid', function (req, res, next) {
    var playerid = req.params.playerid;
    var name = req.body.name;
    var elo = req.body.elo;
    console.log(elo);
    // TODO: error handling
    Player.findById(playerid).exec()
        .then(function (player) {
            // update player
            // TODO: refactor if better "javascript way" exists
            if (name !== undefined) {
                player.name = name;
            }
            if (elo !== undefined || !(typeof elo === "number")) {
                player.elo = elo;
            }
            player.save();
            console.log('updated player: name: ' + player.name + ', elo:' + elo);
            res.json(player);
        })
        .catch(function (err) {
            // error handling
            console.log('ERROR during post via playerid: ' + err);
            res.status(500).send();
        });
});

router.get('/:playerid', function (req, res, next) {
    var playerid = req.params.playerid;
    // TODO: error handling, also see TODO in router.delete
    Player.findById(playerid).exec()
        .then(function (player) {
            if (player == null) {
                res.status(404).send();
            } else {
                console.log('GET successful: returning player with id ' + playerid);
                res.json(player);
            }
        })
        .catch(function (err) {
            console.log('GET player by playerid failed: ' + err);
            res.status(500).send();
        });
});

router.get('/page/:pageindex', function (req, res, next) {
    var pageindex = req.params.pageindex;
    // TODO: implement returning just a subset of players, currently all players are returned regardless of the pageindex
    Player.find({}).exec()
        .then(function (players) {
            if (players.length === 0) {
                console.log('GET succesful: no players -> returning empty list');
                res.json({});
            }
            else {
                console.log('GET successful: returning players with pageindex ' + pageindex);
                res.json(players);
            }
        })
        .catch(function (err) {
            console.log('GET players by pageindex failed:' + err);
            res.status(500).send();
        });
});

router.delete('/:playerid', function (req, res, next) {
    var playerid = req.params.playerid;
    // TODO: how to catch error when id not correct (different cases)?
    // case 1: /IDWhichisTooShort -> err -> 500 (should be 404 but not all DB-errors are)
    // case 2: /IDWithCorrectLengthButNotInDB -> 500 (should be 404, can be handled via if(player === null) but ugly)
    Player.findByIdAndRemove(playerid).exec()
        .then(function (player) {
            if (player === null) {
                res.status(404).send();
            } else {
                console.log('DELETE successful:  player with id ' + playerid + ' deleted!');
                res.json(player);
            }
        })
        .catch(function (err) {
            console.log('DELETE player by playerid failed: ' + err);
            res.status(500).send();
        });
});

module.exports = router;
