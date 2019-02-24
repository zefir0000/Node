const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const newsModel = require('../models/news/news')
const random = require('../helper/Random');
const { check, validationResult } = require('express-validator/check');

exports.getNews = (req, res) => {
    // var title = require('url').parse(req.url, true).query.name;
    // if (!title) { title = "" }
    knex.from('News')
        // .where('title', 'like', '%' + title + '%')
        .then(function (newses) {
            res.json(newses)
            res.statusCode = 200;
            // res.render('pages/News', { newses })
        });
};
exports.getNewsById = (req, res) => {
    var newsId = (req.url.substring(req.url.indexOf('getNewsById/') + 12));
    knex.from('News')
         .where('newsId', newsId)
        .then(function (newses) {
            res.json(newses[0])
            res.statusCode = 200;
        });
};

exports.getTopTen = (req, res) => {
    knex.min('ProductVariant.price as price')
    .select('ProductVariant.title',
    'ProductBase.productBaseId', 
    'ProductVariant.availability', 
    'ProductBase.image',
    'ProductBase.platform', 
    'ProductVariant.currency')
    .from('ProductVariant')
    .rightJoin('ProductBase', function() {
        this.on('ProductVariant.productBaseId', '=', 'ProductBase.productBaseId')
    })
    .whereNotNull('ProductBase.topTen').andWhere('ProductVariant.currency', "USD")
    .groupBy('ProductVariant.title', 'ProductBase.productBaseId', 'ProductVariant.availability')
    .orderBy([{ column: 'ProductVariant.availability', order: 'desc' }, { column: 'topTen', order: 'asc' }])    
    .limit(10)
    .then(function(SQLProducts){
        res.statusCode = 200;
        console.log(SQLProducts)
        res.json(SQLProducts)
    });
};

exports.createNews = async (req, res, next) => {
    var news = await newsModel.createNews({
        'title': req.body.title,
        'imageLink': req.body.imageLink,
        'news': req.body.news,
        'likes': 0,
        'unlikes': 0,
    }).catch((err) => {
        console.log(err);
        return err
    });

    if (news == undefined) {
        req.flash('form', 'Added News! ' + req.body.title + '');
        res.redirect('news');
    } else {
        req.flash('form', 'Something went wrong with: ' + news.sqlMessage);
        res.redirect('news');
    }
};

exports.updateNews = async (req, res) => {
    var newsId = (req.url.substring(req.url.indexOf('editNews/') + 9));
    var news = await newsModel.updateNews({
        'newsId': newsId,
        'title': req.body.title,
        'imageLink': req.body.imageLink,
        'news': req.body.news,
        'likes': req.body.likes,
        'unlikes': req.body.unlikes,
    }).catch((err) => { console.log(err); return err });
    if (news.sqlMessage == undefined) {
        req.flash('form', 'Edited product base! ' + req.body.title + '');
        res.redirect('../news');
    } else {
        req.flash('form', 'Something went wrong with: ' + news.sqlMessage);
        res.redirect('../news');
    }
};

exports.getMems = (req, res) => {
    knex.from('Mems')
        .then(function (mems) {
            let lengthMem = mems.length - 1
            randomMem = random(0,lengthMem)
            console.log(mems[randomMem])
            res.json(mems[randomMem])
            res.statusCode = 200;
        });
};


