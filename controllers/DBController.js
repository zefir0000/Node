const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

exports.getProducts = (req, res) => {
    var name = require('url').parse(req.url,true).query.name;
    knex.from('ProductsFromShopsEUR')
    .where('title', 'like', name + '%')
    .andWhereRaw(`availability = "in stock"`)
    .then(function(SQLProducts){
        res.statusCode = 200;
        console.log(SQLProducts);
        res.render('pages/search', {
            SQLProducts
        });
    });
};
