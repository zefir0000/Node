const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const dealModel = require('../models/deal/deal')

exports.getDeals = (req, res) => {
    var name = req.query.name
    if (!name) { name = "" }
    knex.from('Deal')
        .where('title', 'like', '%' + name + '%')
        .then(function (deals) {
            res.statusCode = 200;
            res.render('pages/deals', { deals })
        });
};

exports.addDealPage = (req, res) => {
    res.render('createPages/addDeal', {
        formMessage: req.flash('form')
    });
};

exports.createDeal = async (req, res, next) => {
    console.log('contr', req.body)
    await dealModel.createDeal({
        'user': req.body.user,
        'title': req.body.title,
        'link': req.body.link,
        'image': req.body.image,
        'price': req.body.price,
        'currency': req.body.currency
    }).catch((err) => {
        console.log(err);
        return err
    });
    req.flash('form', 'Added Deal! ' + req.body.name + '');
    res.redirect('../deals');
};

exports.updateDeal = async (req, res) => {
    // var marketId = (req.url.substring(req.url.indexOf('editDeal/') + 9));
    dealId = req.params.dealId
    await dealModel.updateDeal({
        'dealId': dealId,
        'user': req.body.user,
        'title': req.body.title,
        'link': req.body.link,
        'image': req.body.image,
        'price': req.body.price,
        'currency': req.body.currency

    }).catch((err) => { console.log(err); return err });

    req.flash('form', 'Edited deal! ' + dealId + '');
    res.redirect('../deals');

};

exports.editDealPage = (req, res) => {
    knex.from('Deal')
        .where('dealId', req.params.dealId)
        .then(function (deal) {
            res.statusCode = 200;
            res.render('editPage/editDeal', {
                deal,
                formMessage: req.flash('form')
            })
        });
};

exports.deleteDeal = (req, res) => {
    knex.from('Deal')
        .where('dealId', req.params.dealId)
        .del()
        .then(function () {
            res.statusCode = 204;
            req.flash('Deleted deal with id: ', req.params.dealId, ' succeed!');
            res.redirect('../deals')
        });
};

