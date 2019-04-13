const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const productBaseModel = require('../models/product/productBase')

exports.getProductBase = (req, res) => {
    var title = req.query.name || "";
    var topTen = req.query.topten;
    var topTenRaw;
    var orderBy = 'title';
    if (!topTen) { topTenRaw = '', orderBy = 'title' } else { topTenRaw = 'topTen >= 0', orderBy = 'topTen' }
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

exports.addProductBasePage = (req, res) => {
    res.render('createPages/addProductBase', {
        formMessage: req.flash('form')
    });
};

exports.createProductBase = async (req, res, next) => {
    await productBaseModel.createProductBase({
        'title': req.body.title,
        'image': req.body.image,
        'description': req.body.description,
        'platform': req.body.platform,
    }).catch((err) => {
        console.log(err);
        return err
    });
    req.flash('form', 'Added ProductBase! ' + req.body.title + '');
    res.redirect('../productBase');
};

exports.editProductBasePage = (req, res) => {
    knex.from('ProductBase')
        .where('productBaseId', req.params.productBaseId)
        .then(function (product) {
            res.statusCode = 200;
            res.render('editPage/editProductBase', {
                product,
            })
        });
};

exports.updateProductBase = async (req, res) => {
    var productBaseId = req.params.productBaseId
    var topTen = req.body.topTen;

    if (req.body.topTen === '') { topTen = null } else {
        await knex.from('ProductBase')
            .where('topTen', req.body.topTen)
            .then(function (product) {
                if (JSON.stringify(product) != '[]') {
                    productBaseModel.delTopTenProductBase({
                        'productBaseId': product[0].productBaseId,
                        'topTen': null,
                    }).catch((err) => { console.log(err); return err });
                }
            });
    }

    var productBase = await productBaseModel.updateProductBase({
        'productBaseId': productBaseId,
        'title': req.body.title,
        'image': req.body.image,
        'description': req.body.description,
        'platform': req.body.platform,
        'topTen': topTen

    }).catch((err) => { console.log(err); return err });

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

