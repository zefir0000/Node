const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const marketModel = require('../models/market/market')
const { check, validationResult } = require('express-validator/check');
const PagesController = require('./PagesController');


exports.getMarket = (req, res) => { 
    var name = require('url').parse(req.url,true).query.name;
    if(!name) {name = ""}
    console.log('asd')

    knex.from('Market')
    .where('name', 'like', '%' + name + '%')
    .then(function(markets) {
        res.statusCode = 200;
        console.log(markets)
        res.render('pages/market', { markets })
    });
};

exports.createMarket = async (req, res, next) => { 
    var market = await marketModel.createMarket({
        'name': req.body.name,
        'support': req.body.support,
        'logo': req.body.logo,
        'link': req.body.linkMarket, 
        'description': req.body.description,
        'raiting': req.body.raiting,
        'adress': req.body.adress,
     }).catch((err) => { console.log(err); 
        return err });

     if (market.sqlMessage == undefined) { 
         console.log(market.Error,'exist?')
        req.flash('form','Added market! ' + req.body.name + '');
            res.redirect('market');
    } else { 
        req.flash('form','Something went wrong with: ' + market.sqlMessage);
        res.redirect('market');}   
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
        req.flash('Deleted market with id: ',req.params.marketId,' succeed!');
        res.redirect('../market')
        console.log('Deleted market with id: ',req.params.marketId,' succeed!')
    });
    
};

