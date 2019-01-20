const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

exports.getProducts = (req, res) => {
    var name = require('url').parse(req.url,true).query.name;
    knex.from('ProductsFromShopsUSD')
    .where('title', 'like', name + '%')
    .andWhereRaw(`availability = "in stock"`)
    .orderBy('title')
    .then(function(SQLProducts){
        res.statusCode = 200;
        res.render('pages/search', {
            SQLProducts
        });
    });
};

exports.getProd = (req, res) => {
    var name = require('url').parse(req.url,true).query.name;
    knex.from('ProductsFromShopsUSD')
    .where('title', 'like', name + '%')
    .andWhereRaw(`availability = "in stock"`)
    .orderBy('price')
    .limit(20)
    .then(function(SQLProducts){
        res.statusCode = 200;
        res.json(SQLProducts)
            
    });
};

exports.getProductById = (req, res) => {
    var id = require('url').parse(req.url,true).query.id;
    console.log("path",id);
    knex.from('ProductsFromShopsUSD')
    .where('id', id)
    .then(function(SQLProducts){
        res.statusCode = 200;
        res.json(SQLProducts)
    });
};

exports.getProductVariantByBaseId = (req, res) => {
    var id = require('url').parse(req.url,true).query.id;
    console.log("path",req.url);
    knex.from('ProductBase')
    .where('productBaseId', id)
    .then(function(ProductBase){
        knex.from('ProductVariant')
        .where('productBaseId', id)
        .orderBy([{ column: 'ProductVariant.availability', order: 'desc' }, { column: 'price', order: 'asc' }])  
        .then(function(RelatedProducts) {
            res.statusCode = 200;
            var result = Object.assign({}, {ProductBase}, {RelatedProducts});
            res.json(result)
        })  
    });
};

exports.getProductBase = (req, res) => {
    var name = require('url').parse(req.url,true).query.name;
    var currency = require('url').parse(req.url,true).query.currency;
    knex.min('ProductVariant.price as price')
    .select('ProductVariant.title', 'ProductBase.productBaseId', 'ProductVariant.availability', 'ProductBase.image', 'ProductBase.platform', 'ProductVariant.currency')
    .from('ProductVariant')
    .rightJoin('ProductBase', function() {
        this.on('ProductVariant.productBaseId', '=', 'ProductBase.productBaseId')
    })
    .where('ProductBase.title', 'like', name + '%').andWhere('ProductVariant.currency', currency)
    .groupBy('ProductVariant.title', 'ProductBase.productBaseId', 'ProductVariant.availability')
    .orderBy([{ column: 'ProductVariant.availability', order: 'desc' }, { column: 'price', order: 'asc' }])    
    .then(function(SQLProducts){
        res.statusCode = 200;
        res.json(SQLProducts)
    });
};
