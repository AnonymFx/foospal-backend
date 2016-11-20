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
    if (!isObjectIdValid(playerid)) {
        respondWithHttpError(res, 400, 'GET failed: malformed id');
    } else {
        // TODO: error handling
        Player.findById(playerid).exec()
            .then(function (player) {
                // update player
                // TODO: refactor if better "javascript way" exists
                if (name !== undefined) {
                    player.name = name;
                }
                if (elo !== undefined || !(typeof elo === 'number')) {
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
    }
});

router.get('/:playerid', function (req, res, next) {
    var playerid = req.params.playerid;
    if (!isObjectIdValid(playerid)) {
        respondWithHttpError(res, 400, 'GET failed: malformed id');
    } else {
        Player.findById(playerid).exec()
            .then(function (player) {
                if (player == null) {
                    respondWithHttpError(res, 404, "GET failed: no player with requested id available");
                } else {
                    console.log('GET successful: returning player with id ' + playerid);
                    res.json(player);
                }
            })
            .catch(function (err) {
                respondWithHttpError(res, 500, 'GET failed: internal error', err);
            });
    }
});

router.get('/page/:pageindex', function (req, res, next) {
    var pageindex = req.params.pageindex;
    if (typeof pageindex !== 'number') {
        respondWithHttpError(res, 404, "GET failed: pageindex not a number");
    } else {
        // TODO: implement returning just a subset of players, currently all players are returned regardless of the pageindex
        Player.find({}).exec()
            .then(function (players) {
                if (players.length === 0) {
                    console.log('GET successful: no players -> returning empty list');
                    res.json({});
                }
                else {
                    console.log('GET successful: returning players with pageindex ' + pageindex);
                    res.json(players);
                }
            })
            .catch(function (err) {
                respondWithHttpError(res, 500, 'GET failed: internal error', err);
            });
    }
});

router.delete('/:playerid', function (req, res, next) {
    var playerid = req.params.playerid;
    if (!isObjectIdValid(playerid)) {
        respondWithHttpError(res, 400, 'GET failed: malformed id');
    } else {
        Player.findByIdAndRemove(playerid).exec()
            .then(function (player) {
                if (player === null) {
                    respondWithHttpError(res, 404, "DELETE failed: no player with requested id available");
                } else {
                    console.log('DELETE successful:  player with id ' + playerid + ' deleted!');
                    res.json(player);
                }
            })
            .catch(function (err) {
                respondWithHttpError(res, 500, 'DELETE failed: internal error', err);
            });
    }
});

function isObjectIdValid(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function respondWithHttpError(res, errorcode, msg, err) {
    var completeMsg = msg;
    if (err !== undefined) {
        completeMsg += err;
    }
    console.log(completeMsg);
    res.status(errorcode).send();
}

module.exports = router;
