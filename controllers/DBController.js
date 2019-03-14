const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

exports.getProductVariantByBaseId = (req, res) => {
    knex.from('ProductBase')
        .where('productBaseId', req.query.id)
        .then(function (ProductBase) {
            knex.from('ProductVariant')
                .where('productBaseId', req.query.id)
                .orderBy([{ column: 'ProductVariant.availability', order: 'desc' }, { column: 'price', order: 'asc' }])
                .then(function (RelatedProducts) {
                    res.statusCode = 200;
                    var result = Object.assign({}, { ProductBase }, { RelatedProducts });
                    res.json(result)
                })
        });
};

exports.getProductBase = (req, res) => {
    var name = req.query.name;
    var currency = req.query.currency;
    var title = name.replace(/ /g, "%")

    knex.min('ProductVariant.price as price')
        .select('ProductVariant.title', 'ProductBase.productBaseId', 'ProductVariant.availability', 'ProductBase.image', 'ProductBase.platform', 'ProductVariant.currency')
        .from('ProductVariant')
        .rightJoin('ProductBase', function () {
            this.on('ProductVariant.productBaseId', '=', 'ProductBase.productBaseId')
        })
        .where('ProductBase.title', 'like', '%' + title + '%').andWhere('ProductVariant.currency', currency)
        .groupBy('ProductVariant.title', 'ProductBase.productBaseId', 'ProductVariant.availability')
        .orderBy([{ column: 'ProductVariant.availability', order: 'desc' }, { column: 'price', order: 'asc' }])
        .limit(50)
        .then(function (SQLProducts) {
            res.statusCode = 200;
            res.json(SQLProducts)
        });
};

exports.market = (req, res) => {
    var name = req.query.name;
    knex.from('Market')
        .where('name', name)
        .then(function (market) {
            res.statusCode = 200;
            res.json(market)
        });
};
