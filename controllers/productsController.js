const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

exports.getProducts = (req, res) => {
    var name = require('url').parse(req.url,true).query.name;
    knex.from('ProductBase')
    .where('title', 'like', name + '%')
    .andWhereRaw(`availability = "in stock"`)
    .orderBy('price')
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


