var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Player = mongoose.model('Player');

router.post('/add', function (req, res, next) {
    var player = new Player(req.body);
    /* TODO: error handling and validation (see post playerid as template)*/
    player.save().then(function (player) {
        console.log('POST successful: Saving player (ID = ' + player._id + ', Name = ' + player.name + ', ELO = ' + player.elo + ')');
        res.json(player);
    }, function (err) {
        console.log('POST failed: Could not save player ' + player.name + '; internal error: ' + err);
        res.status(500);
        res.send();
    });
});

router.post('/:playerid', function (req, res, next) {
    var playerId = req.params.playerid;
    var name = req.body.name;
    var elo = req.body.elo;
    var validationResult = validatePostPlayerRequest(name, elo, playerId);
    if (validationResult.valid === false) {
        respondWithHttpError(res, 400, validationResult.errormsg);
    }
    Player.findById(playerId).exec()
        .then(function (player) {
            if (player == null) {
                respondWithHttpError(res, 400, "POST failed: no player with requested id available");
            } else {
                player.name = name;
                player.elo = elo;
                player.save();
                console.log('POST successful: updated player successful (Name = ' + name + ', ELO = ' + elo + ')');
                res.json(player);
            }
        })
        .catch(function (err) {
            // error handling
            console.log('POST failed: Could not update player with id ' + playerId + '; internal error:' + err);
            res.status(500).send();
        });
});

function validatePostPlayerRequest(name, elo, playerid) {
    var validationErrorMsg = '';
    if (typeof name !== 'string') {
        validationErrorMsg += ' "name" is not a string;';
    }
    if (typeof elo !== 'number') {
        validationErrorMsg += ' "elo" is not a number;';
    }
    if (!isObjectIdValid(playerid)) {
        validationErrorMsg += ' playerid is not an ObjectId';
    }
    if (validationErrorMsg !== '') {
        return {
            valid: false,
            errormsg: 'POST failed: Validation error - malformed request:' + validationErrorMsg
        };
    } else {
        return {valid: true};
    }
}

router.get('/:playerid', function (req, res, next) {
    var playerid = req.params.playerid;
    // TODO: refactor validation (see post playerid as template)
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
                respondWithHttpError(res, 500, 'GET failed: Could not find player with id ' + playerid + ';internal error', err);
            });
    }
});

router.get('/page/:pageindex', function (req, res, next) {
    var pageindex = req.params.pageindex;
    // TODO: refactor validation (see post playerid as template)
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
                respondWithHttpError(res, 500, 'GET failed: Could not retrieve players from page ' + pageindex + ';internal error', err);
            });
    }
});

router.delete('/:playerid', function (req, res, next) {
    // TODO: refactor validation (see post playerid as template)
    var playerid = req.params.playerid;
    if (!isObjectIdValid(playerid)) {
        respondWithHttpError(res, 400, 'DELETE failed: malformed id');
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
    res.status(errorcode).send(msg);
}

module.exports = router;
