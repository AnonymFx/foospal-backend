var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Player = mongoose.model('Player');

router.post('/add', function (req, res, next) {
    var player = new Player(req.body);
    var validationResult = validatePostNewPlayerRequest(player.name, player.elo);
    if (!validationResult.valid) {
        respondWithHttpError(res, 400, validationResult.errormsg);
    } else {
        player.save().then(function (player) {
            console.log('POST successful: Saving player (ID = ' + player._id + ', Name = ' + player.name + ', ELO = ' + player.elo + ')');
            res.json(player);
        }).catch(function (err) {
            console.log('POST failed: Could not save player ' + player.name, err);
            res.status(500).send();
        });
    }
});

function validatePostNewPlayerRequest(name, elo) {
    var validationErrorMsg = '';
    if (typeof name !== 'string') {
        validationErrorMsg += ' "name" is not a string;';
    }
    if (typeof elo !== 'number') {
        validationErrorMsg += ' "elo" is not a number;';
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

router.post('/:playerId', function (req, res, next) {
    var playerId = req.params.playerId;
    var name = req.body.name;
    var elo = req.body.elo;
    var validationResult = validatePostPlayerRequest(name, elo, playerId);
    if (!validationResult.valid) {
        respondWithHttpError(res, 400, validationResult.errormsg);
    } else {
        Player.findById(playerId).exec()
            .then(function (player) {
                if (player == null) {
                    respondWithHttpError(res, 404, "POST failed: no player with requested id available");
                } else {
                    // name is optional
                    if (name !== undefined) {
                        player.name = name;
                    }
                    // elo is optional
                    if (elo !== undefined) {
                        player.elo = elo;
                    }
                    player.save();
                    console.log('POST successful: updated player successful (Name = ' + name + ', ELO = ' + elo + ')');
                    res.json(player);
                }
            })
            .catch(function (err) {
                respondWithHttpError(res, 500, 'POST failed: Could not update player with id ' + playerId, err);
            });
    }
});

function validatePostPlayerRequest(name, elo, playerId) {
    var validationErrorMsg = '';
    if (name !== undefined && typeof name !== 'string') {
        validationErrorMsg += ' "name" is not a string;';
    }
    // elo is optional, check for existence first
    if (elo !== undefined && typeof elo !== 'number') {
        validationErrorMsg += ' "elo" is not a number;';
    }
    if (!isObjectIdValid(playerId)) {
        validationErrorMsg += ' playerId is not an ObjectId';
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

router.get('/:playerId', function (req, res, next) {
    var playerId = req.params.playerId;
    var validationResult = validateGetPlayerRequest(playerId);
    if (!validationResult.valid) {
        respondWithHttpError(res, 400, validationResult.errormsg);
    } else {
        Player.findById(playerId).exec()
            .then(function (player) {
                if (player == null) {
                    respondWithHttpError(res, 404, "GET failed: no player with requested id available");
                } else {
                    console.log('GET successful: returning player with id ' + playerId);
                    res.json(player);
                }
            })
            .catch(function (err) {
                respondWithHttpError(res, 500, 'GET failed: Could not find player with id ' + playerId, err);
            });
    }
});

function validateGetPlayerRequest(playerId) {
    var validationErrorMsg = '';
    if (!isObjectIdValid(playerId)) {
        validationErrorMsg += ' playerId is not an ObjectId';
    }
    if (validationErrorMsg !== '') {
        return {
            valid: false,
            errormsg: 'GET failed: Validation error - malformed request:' + validationErrorMsg
        };
    } else {
        return {valid: true};
    }
}

router.get('/page/:pageIndex', function (req, res, next) {
    // conversion to int (else type check fails)
    var pageIndex = parseInt(req.params.pageIndex);
    var validationResult = validateGetPlayerPageRequest(pageIndex);
    if (!validationResult.valid) {
        respondWithHttpError(res, 400, validationResult.errormsg);
    } else {
        // TODO: implement returning just a subset of players, currently all players are returned regardless of the pageIndex
        Player.find({}).exec()
            .then(function (players) {
                if (players.length === 0) {
                    console.log('GET successful: no players -> returning empty list');
                    res.json({});
                }
                else {
                    console.log('GET successful: returning players with pageIndex ' + pageIndex);
                    res.json(players);
                }
            })
            .catch(function (err) {
                respondWithHttpError(res, 500, 'GET failed: Could not retrieve players from page ' + pageIndex, err);
            });
    }
});

function validateGetPlayerPageRequest(pageIndex) {
    var validationErrorMsg = '';
    if (typeof pageIndex !== 'number') {
        validationErrorMsg += ' pageIndex is not a number';
    }
    if (validationErrorMsg !== '') {
        return {
            valid: false,
            errormsg: 'GET failed: Validation error - malformed request:' + validationErrorMsg
        };
    } else {
        return {valid: true};
    }
}

router.delete('/:playerId', function (req, res, next) {
    var playerId = req.params.playerId;
    var validationResult = validateDeletePlayerRequest(playerId);
    if (!validationResult.valid) {
        respondWithHttpError(res, 400, validationResult.errormsg);
    } else {
        Player.findByIdAndRemove(playerId).exec()
            .then(function (player) {
                if (player === null) {
                    respondWithHttpError(res, 404, "DELETE failed: no player with requested id available");
                } else {
                    console.log('DELETE successful:  player with id ' + playerId + ' deleted!');
                    res.json(player);
                }
            })
            .catch(function (err) {
                respondWithHttpError(res, 500, 'DELETE failed: internal error', err);
            });
    }
});

function validateDeletePlayerRequest(playerId) {
    var validationErrorMsg = '';
    if (!isObjectIdValid(playerId)) {
        validationErrorMsg += ' playerId is not an ObjectId';
    }
    if (validationErrorMsg !== '') {
        return {
            valid: false,
            errormsg: 'DELETE failed: Validation error - malformed request:' + validationErrorMsg
        };
    } else {
        return {valid: true};
    }
}

function isObjectIdValid(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

function respondWithHttpError(res, errorcode, msg, err) {
    var completeMsg = msg;
    if (err !== undefined) {
        completeMsg += '; internal error: ' + err;
    }
    console.log(completeMsg);
    res.status(errorcode).send(msg);
}

module.exports = router;
