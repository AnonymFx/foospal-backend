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

module.exports = router;
