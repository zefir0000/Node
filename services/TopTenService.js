const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

module.exports = {
    getTopTen: () => {
        return knex.min('ProductVariant.price as price')
            .select('ProductVariant.title',
                'ProductBase.productBaseId',
                'ProductVariant.availability',
                'ProductBase.image',
                'ProductBase.topTen',
                'ProductBase.platform',
                'ProductVariant.currency')
            .from('ProductVariant')
            .rightJoin('ProductBase', function () {
                this.on('ProductVariant.productBaseId', '=', 'ProductBase.productBaseId')
            })
            .whereNotNull('ProductBase.topTen').andWhere('ProductVariant.currency', "EUR")
            .groupBy('ProductVariant.title', 'ProductBase.productBaseId', 'ProductVariant.availability')
            .orderBy([{ column: 'ProductVariant.availability', order: 'desc' }, { column: 'topTen', order: 'asc' }])
            .limit(25)
    }
}