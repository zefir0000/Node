const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const axios = require('axios');

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

// productBase Admin
exports.productBase = (req, res) => {
    var title = require('url').parse(req.url,true).query.name;
    var topTen = require('url').parse(req.url,true).query.topten;
    var topTenRaw;
    var orderBy = 'name';
    if(!topTen) { toptenraw = '', orderBy ='name' } else { topTenRaw = 'topTen >= 0', orderBy = 'topTen' }
    if(!title) { title = "" }
console.log(topTen)
        knex.from('ProductBase')
    .limit(100)
    .where('title', 'like', '%' + title + '%')
    .andWhereRaw(topTenRaw)
    .orderBy(orderBy)
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
        }).catch((err) => { console.log(err); return err });
    });
};
// font get market
exports.market = (req, res) => {
    var name = require('url').parse(req.url,true).query.name;
    if(!name) {name = ""}

    knex.from('Market')
    .where('name', 'like', '%' + name + '%')
    .then(function(markets) {
        axios.get(markets[0].raiting )
        .then(response => {

        var products = response.data;
        var begin = products.indexOf('<script type="application/ld+json" data-business-unit-json-ld>')
        var string = (products.substring(begin + 62));
        var end = string.indexOf('</script>');
        var trustpilot = JSON.parse(string.substring(0,end -10));
        var result = Object.assign({}, {markets}, {trustpilot});

        res.statusCode = 200;
        res.json(result)

            }).catch((err) => { 
                console.log( err )})
        
    }).catch((err) => { 
        console.log( err )});
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
    .limit(1)
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
// mems Admin
exports.mems = (req, res) => {
    knex.from('Mems')
    .then(function(mems) {
        res.statusCode = 200;
        res.render('pages/mem', { 
            mems,
            formMessage: req.flash('form')
        }) 
    });
};

