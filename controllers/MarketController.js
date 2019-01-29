const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const marketModel = require('../models/market/market')
const { check, validationResult } = require('express-validator/check');


exports.getMarket = (req, res) => { 
    var name = require('url').parse(req.url,true).query.name;
    knex.from('Market')
    .where('name', name)
    .then(function(market) {
        res.statusCode = 200;
        res.json(market)
    });
};

exports.createMarket = (req, res, next) => { 
    marketModel.createMarket({
        'name': req.body.name,
        'support': req.body.support,
        'logo': req.body.logo,
        'link': req.body.linkMarket, 
        'description': req.body.description,
        'raiting': req.body.raiting,
        'adress': req.body.adress,
     }).catch((err) => { console.log(err); 
        res.flash('form','Something went wrong with ' + req.body.name + ' ' + err);
        return err });
     
req.flash('form','Added market! ' + req.body.name);
res.redirect('getMarket?name=');
};

exports.updateMarket = (req, res) => { 
    marketModel.updateMarket({
        'marketId': req.params.marketId,
        'name': req.body.name,
        'support': req.body.support,
        'logo': req.body.logo,
        'link': req.body.link, 
        'description': req.body.description,
        'rating': req.body.rating,
     }).catch((err) => { console.log(err); return err });
};

exports.deleteMarket = (req, res) => { 
    knex.from('Market')
    .where('marketId', req.params.marketId)
    .del()
    .then(function() {
        res.statusCode = 204;
        console.log('Deleted market with id: ',req.params.marketId,' succeed!')
    });
};