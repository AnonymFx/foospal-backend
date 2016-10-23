var express = require('express');
var router = express.Router();
var Player = require('../models/Player');


var mongoose = require('mongoose');

router.get('/', function (req, res, next) {
    var myPlayer = new Player({name: 'myplayername', elo: '1234'});
    myPlayer.test();
    myPlayer.rename('blub');
    myPlayer.test();
    try {
        myPlayer.rename(1.234);
    } catch (e) {
        console.log(e);
    }
    res.json(myPlayer);
});

router.post('/player/add', function (req, res, next) {
    console.log('start');
    var name = req.query.playername;
    console.log('name:' + name);
    if (typeof name === 'string') {
        mongoose.model('Player').create({
            name: name,
            elo: '1500'
        }, function (err, player) {
            if (err) {
                res.send('There was a problem adding the information to the database');
            } else {
                res.json({id: player._id})
            }
        });
    } else {
        res.status(400);
    }
});

router.get('/player/:id', function (req, res, next) {
    mongoose.model('Player').findById(req.params.id, function (err, player) {
        if (err) {
            console.log('GET Error: ' + err);
            res.status(500);
            res.send('GET request failed');
        } else {
            if (player === null) {
                console.log('GET Error: Player with ID ' + req.params.id + ' does not exist');
                res.status(400);
            } else {
                console.log('GET Player with ID: ' + player);
                res.json(player);
            }
        }
    })
});

module.exports = router;
