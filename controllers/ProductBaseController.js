const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const productBaseModel = require('../models/product/productBase')
const { check, validationResult } = require('express-validator/check');

exports.getProductBase = (req, res) => {
    var name = require('url').parse(req.url, true).query.name;
    if (!name) { name = "" }

    knex.from('ProductBase')
        .where('title', 'like', '%' + name + '%')
        .then(function (ProductsBase) {
            res.statusCode = 200;
            res.render('pages/productBase', { ProductsBase })
        });
};

exports.createProductBase = async (req, res, next) => {
    var productBase = await productBaseModel.createProductBase({
        'title': req.body.title,
        'imageLink': req.body.imageLink,
        'description': req.body.description,
        'platform': req.body.platform,
    }).catch((err) => {
        console.log(err);
        return err
    });

    if (productBase.sqlMessage == undefined) {
        req.flash('form', 'Added ProductBase! ' + req.body.title + '');
        res.redirect('productBase');
    } else {
        req.flash('form', 'Something went wrong with: ' + productBase.sqlMessage);
        res.redirect('productBase');
    }
};

exports.updateProductBase = async (req, res) => {
    var productBaseId = (req.url.substring(req.url.indexOf('editProductBase/') + 16));
    var topTen = req.body.topTen;
    
    if (req.body.topTen === "null") { topTen = null} 

    var productBase = await productBaseModel.updateProductBase({
        'productBaseId': productBaseId,
        'title': req.body.title,
        'imageLink': req.body.imageLink,
        'description': req.body.description,
        'platform': req.body.platform,
        'topTen': topTen

    }).catch((err) => { console.log(err); return err });

    knex.from('ProductBase') // sprawdzic jak wrzucic wyszukanie i ustawienie null na bazie jednym strzalem (aktualnie jest ich 3)
    .where('topTen', req.body.topTen)
    .then(function (product) {
        if(product.lenght != 0 & req.body.topTen != "null") {
            productBaseModel.updateProductBase({
                'productBaseId': product.productBaseId,
                'topTen': null,
            }).catch((err) => { console.log(err); return err });
        }
    });

    if (productBase.sqlMessage == undefined) {
        req.flash('form', 'Edited product base! ' + productBaseId + '');
        res.redirect('../productBase');
    } else {
        req.flash('form', 'Something went wrong with: ' + productBase.sqlMessage);
        res.redirect('../productBase');
    }
};

exports.deleteProductBase = (req, res) => {
    knex.from('ProductBase')
        .where('productBaseId', req.params.productBaseId)
        .del()
        .then(function () {
            res.statusCode = 204;
            req.flash('Deleted product base with id: ', req.params.productBaseId, ' succeed!');
            res.redirect('../productBase')
        });
};

