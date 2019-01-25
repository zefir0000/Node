const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const marketModel = require('../models/market/market')


exports.getMarket = (req, res) => { 
    var name = require('url').parse(req.url,true).query.name;
    knex.from('Market')
    .where('name', name)
    .then(function(market) {
        res.statusCode = 200;
        res.json(market)
    });
};

exports.createMarket = (req, res) => { 
    marketModel.createMarket({
        'name': req.body.name,
        'support': req.body.support,
        'logo': req.body.logo,
        'link': req.body.link, 
        'description': req.body.description,
        'rating': req.body.rating,
     }).catch((err) => { console.log(err); err.status(400); return err });
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
     }).catch((err) => { console.log(err); err.status(400); return err });
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