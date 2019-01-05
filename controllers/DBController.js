const options = {
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'pass',
        database: 'ProductCatalog'
    }};
const knex = require('knex')(options);

exports.getProducts = (req, res) => {
    knex.from('ProductBaseGBP').column(['title', 'price'])
    .whereRaw('availability = in stock AND title LIKE ' +`'%${req.name}%'`).select().timeout(10000, { cancel: true })
    .then(function(SQLProducts){
        res.statusCode = 200;
        console.log(SQLProducts);
        res.render('pages/search', {
            SQLProducts
    });
});
};
