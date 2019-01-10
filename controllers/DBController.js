const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

exports.getProducts = (req, res) => {
    var name = require('url').parse(req.url,true).query.name;
    knex.from('ProductBaseGBP')
    .where('title', 'like', name + '%')
    .andWhereRaw(`availability = "in stock"`)
    .then(function(SQLProducts){
        res.statusCode = 200;
        res.render('pages/search', {
            SQLProducts
        });
    });
};

exports.getJson = (req, res) => {
    var name = require('url').parse(req.url,true).query.name;
    knex.from('ProductBaseGBP')
    .where('title', 'like', name + '%')
    .andWhereRaw(`availability = "in stock"`)
    .then(function(SQLProducts){
        res.statusCode = 200;
        res.json(SQLProducts);
    });
};
