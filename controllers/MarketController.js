const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const marketModel = require('../models/market/market')
const { check, validationResult } = require('express-validator/check');

exports.getMarket = (req, res) => {
    var name = require('url').parse(req.url, true).query.name;
    if (!name) { name = "" }

    knex.from('Market')
        .where('name', 'like', '%' + name + '%')
        .then(function (markets) {
            res.statusCode = 200;
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
    }).catch((err) => {
        console.log(err);
        return err
    });

    if (market.sqlMessage == undefined) {
        req.flash('form', 'Added market! ' + req.body.name + '');
        res.redirect('market');
    } else {
        req.flash('form', 'Something went wrong with: ' + market.sqlMessage);
        res.redirect('market');
    }
};

exports.updateMarket = async (req, res) => {
    var marketId = (req.url.substring(req.url.indexOf('editMarket/') + 11));
    var market = await marketModel.updateMarket({
        'marketId': marketId,
        'name': req.body.name,
        'support': req.body.support,
        'logo': req.body.logo,
        'link': req.body.linkMarket,
        'description': req.body.description,
        'rating': req.body.raiting,
    }).catch((err) => { console.log(err); return err });

    if (market.sqlMessage == undefined) {
        req.flash('form', 'Edited market! ' + marketId + '');
        res.redirect('../market');
    } else {
        req.flash('form', 'Something went wrong with: ' + market.sqlMessage);
        res.redirect('../market');
    }
};

exports.deleteMarket = (req, res) => {
    knex.from('Market')
        .where('marketId', req.params.marketId)
        .del()
        .then(function () {
            res.statusCode = 204;
            req.flash('Deleted market with id: ', req.params.marketId, ' succeed!');
            res.redirect('../market')
        });
};

