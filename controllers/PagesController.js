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
    var title = req.query.name || "";
    var topTen = req.query.topten;
    var topTenRaw;
    var orderBy = 'name';
    if (!topTen) { toptenraw = '', orderBy = 'name' } else { topTenRaw = 'topTen >= 0', orderBy = 'topTen' }
    knex.from('ProductBase')
        .limit(100)
        .where('title', 'like', '%' + title + '%')
        .andWhereRaw(topTenRaw)
        .orderBy(orderBy)
        .then(function (productsBase) {
            res.statusCode = 200;
            res.render('pages/productBase', {
                productsBase,
                formMessage: req.flash('form')
            })
        });
};

exports.editProductBase = (req, res) => {
    knex.from('ProductBase')
        .where('productBaseId', req.params.productBaseId)
        .then(function (productBase) {
            res.statusCode = 200;
            res.render('editPage/editProductBase', {
                productBase,
                formMessage: req.flash('form')
            }).catch((err) => { console.log(err); return err });
        });
};
// front get market
exports.market = (req, res) => {
    var name = req.query.name || "";

    knex.from('Market')
        .where('name', 'like', '%' + name + '%')
        .then(function (markets) {
            axios.get(markets[0].raiting)
                .then(response => {
                    var products = response.data;
                    var begin = products.indexOf('<script type="application/ld+json" data-business-unit-json-ld>')
                    var string = (products.substring(begin + 62));
                    var end = string.indexOf('</script>');
                    var trustpilot = JSON.parse(string.substring(0, end - 10));
                    var result = Object.assign({}, { markets }, { trustpilot });

                    res.statusCode = 200;
                    res.json(result)
                }).catch((err) => {
                    console.log(err)
                })
        }).catch((err) => {
            console.log(err)
    });
};

exports.editMarket = (req, res) => {
    knex.from('Market')
        .where('marketId', req.params.marketId)
        .then(function (market) {
            res.statusCode = 200;
            res.render('editPage/editMarket', {
                market,
                formMessage: req.flash('form')
            })
        });
};

// news Admin
exports.news = (req, res) => {
    var title = req.query.name || "";
    knex.from('News')
        .limit(1)
        .where('title', 'like', '%' + title + '%')
        .then(function (newses) {
            res.statusCode = 200;
            res.render('pages/news', {
                newses,
                formMessage: req.flash('form')
            })
        });
};

exports.editNews = (req, res) => {
    knex.from('News')
        .where('newsId', req.params.newsId)
        .then(function (news) {
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
        .then(function (mems) {
            res.statusCode = 200;
            res.render('pages/mem', {
                mems,
                formMessage: req.flash('form')
            })
        });
};

