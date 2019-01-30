const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

exports.home = (req, res) => {
    res.render('home', {
        formMessage: req.flash('form')
    });
};

exports.contact = (req, res) => {
    res.render('pages/contact', {
        formMessage: req.flash('form')
    });
};

exports.upload = (req, res) => {
    res.render('pages/upload', {
        formMessage: req.flash('form')
    });
};

exports.search = (req, res) => {
    res.render('pages/search', {
        formMessage: req.flash('form')
    });
};

exports.market = (req, res) => {
    var name = require('url').parse(req.url,true).query.name;
    if(!name) {name = ""}

    knex.from('Market')
    .where('name', 'like', '%' + name + '%')
    .then(function(markets) {
        res.statusCode = 200;
        res.render('pages/market', { 
            markets, 
            formMessage: req.flash('form')
        })
    });
};

