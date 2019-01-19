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
        console.log(SQLProducts);
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
        console.log(SQLProducts);
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
        console.log(SQLProducts);
        res.json(SQLProducts)
    });
};

exports.getProductBase = (req, res) => {
    var id = require('url').parse(req.url,true).query.id;
    console.log("path",id);
    knex.min('ProductVariant.price as price')
    .select('ProductVariant.title', 'ProductBase.productBaseId', 'ProductVariant.availability', 'ProductBase.image', 'ProductBase.platform')
    .from('ProductVariant')
    .rightJoin('ProductBase', function() {
        this.on('ProductVariant.productBaseId', '=', 'ProductBase.productBaseId')
    })
    .where('ProductBase.title', 'like', 'rage' + '%')
    .groupBy('ProductVariant.title', 'ProductBase.productBaseId', 'ProductVariant.availability')
    .orderBy([{ column: 'ProductVariant.availability', order: 'desc' }, { column: 'price', order: 'asc' }])    
    .then(function(SQLProducts){
        res.statusCode = 200;
        console.log(SQLProducts);
        res.json(SQLProducts)
    });
};
