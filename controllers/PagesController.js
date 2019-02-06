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
// productBase Admin
exports.productBase = (req, res) => {
    var title = require('url').parse(req.url,true).query.name;
    if(!title) { title = "" }

    knex.from('ProductBase')
    .limit(100)
    .where('title', 'like', '%' + title + '%')
    .then(function(productsBase) {
        res.statusCode = 200;
        res.render('pages/productBase', { 
            productsBase,
            formMessage: req.flash('form')
        }) 
    });
};

exports.editProductBase = (req, res) => {
    var productBaseId = (req.url.substring(req.url.indexOf('editProductBase/') + 16));
    knex.from('ProductBase')
    .where('productBaseId', productBaseId)
    .then(function(productBase) {
        res.statusCode = 200;
        res.render('editPage/editProductBase', { 
            productBase, 
            formMessage: req.flash('form')
        })
    });
};
// market Admin
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

exports.editMarket = (req, res) => {
    var marketId = (req.url.substring(req.url.indexOf('editMarket/') + 11));
    knex.from('Market')
    .where('marketId', marketId)
    .then(function(market) {
        res.statusCode = 200;
        res.render('editPage/editMarket', { 
            market, 
            formMessage: req.flash('form')
        })
    });
};
// news Admin
exports.news = (req, res) => {
    var title = require('url').parse(req.url,true).query.name;
    if(!title) { title = "" }

    knex.from('News')
    .limit(100)
    .where('title', 'like', '%' + title + '%')
    .then(function(newses) {
        res.statusCode = 200;
        res.render('pages/news', { 
            newses,
            formMessage: req.flash('form')
        }) 
    });
};

exports.editNews = (req, res) => {
    var newsId = (req.url.substring(req.url.indexOf('editNews/') + 9));
    knex.from('News')
    .where('newsId', newsId)
    .then(function(news) {
        res.statusCode = 200;
        res.render('editPage/editNews', { 
            news, 
            formMessage: req.flash('form')
        })
    });
};

