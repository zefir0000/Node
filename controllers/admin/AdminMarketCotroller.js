const { check, validationResult } = require('express-validator/check');
const dbConfig = require('../../config/dbConfig')
const knex = require('knex')(dbConfig);
const marketModel = require('../../models/market/market')

exports.getMarket = (req, res) => { 
    var name = require('url').parse(req.url,true).query.name;
    console.log('name', name)
    knex.from('Market')
    .where('name', 'like', '%' + name + '%')
    .then(function(markets) {
        res.statusCode = 200;
        console.log(markets)
        res.render('pages/market', { markets })
    });
};