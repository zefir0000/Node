const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const newsModel = require('../models/news/news')
const { check, validationResult } = require('express-validator/check');

exports.getNews = (req, res) => {
    var title = require('url').parse(req.url, true).query.name;
    if (!title) { title = "" }

    knex.from('News')
        .where('title', 'like', '%' + title + '%')
        .then(function (newses) {
            res.statusCode = 200;
            res.render('pages/News', { newses })
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

    console.log('masssage', news)
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

exports.addLike = async (req, res) => {
    var newsId = (req.url.substring(req.url.indexOf('addLike/') + 8));
    var news = await newsModel.addLike({
        'newsId': newsId,
        'likes': req.body.likes,

    }).catch((err) => { console.log(err); return err });

    if (news.sqlMessage == undefined) {
      res.statusCode = 204
    } else {
       res.statusCode = 400
       console.log(news.sqlMessage)
    }
};

exports.addUnlike = async (req, res) => {
    var newsId = (req.url.substring(req.url.indexOf('addUnlike/') + 10));
    var news = await newsModel.addUnlike({
        'newsId': newsId,
        'unlikes': req.body.unlikes,

    }).catch((err) => { console.log(err); return err });

    if (news.sqlMessage == undefined) {
      res.statusCode = 204
    } else {
       res.statusCode = 400
       console.log(news.sqlMessage)
    }
};

exports.deleteNews = (req, res) => {
    knex.from('News')
        .where('newsId', req.params.newsId)
        .del()
        .then(function () {
            res.statusCode = 204;
            req.flash('Deleted news with id: ', req.params.newsId, ' succeed!');
            res.redirect('../news')
        });
};

