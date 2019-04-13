const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

module.exports = {
// SELECT min(`price`) as `ProductVariant.price`, count(ProductVariant.productVariantId) as offerCount, ProductVariant.title, ProductBase.productBaseId, ProductVariant.availability,
// ProductBase.image, ProductBase.platform, ProductVariant.currency 
// FROM ProductCatalog.ProductVariant
// right join ProductCatalog.ProductBase on ProductVariant.productBaseId = ProductBase.productBaseId
// where  ProductBase.title like % { title } and ProductVariant.currency = "EUR"
// group by ProductVariant.title, ProductBase.productBaseId, ProductVariant.availability
    searchProductBase: (title, currency) => {
        return knex.min('ProductVariant.price as price').count('ProductVariant.productVariantId as offerCount')
            .select('ProductVariant.title', 'ProductBase.productBaseId', 'ProductVariant.availability', 'ProductBase.image', 'ProductBase.platform', 'ProductVariant.currency')
            .from('ProductVariant')
            .rightJoin('ProductBase', function () {
                this.on('ProductVariant.productBaseId', '=', 'ProductBase.productBaseId')
            })
            .where('ProductBase.title', 'like', '%' + title + '%').andWhere('ProductVariant.currency', currency)
            .groupBy('ProductVariant.title', 'ProductBase.productBaseId', 'ProductVariant.availability')
            .orderBy([{ column: 'ProductVariant.availability', order: 'desc' }, { column: 'price', order: 'asc' }])
            .limit(50)
    },

    getProductBaseById: (productBaseId) => {
        return knex.from('ProductBase')
            .where('productBaseId', productBaseId)
    },

    getProductOfferForProductBase: (productBaseId) => {
        return knex.select('ProductVariant.*', 'Market.TPraiting', 'Market.TPreviewCount', 'Market.link as shopLink')
            .from('ProductVariant')
            .rightJoin('Market', function () {
                this.on('ProductVariant.shop', '=', 'Market.name')
            })
            .where('productBaseId', productBaseId)
            .orderBy([{ column: 'ProductVariant.availability', order: 'desc' }, { column: 'price', order: 'asc' }])
    },

    getProductBaseByTitle: (title) => {
        return knex('ProductBase').select('title', 'productBaseId')
            .where('title', title)
            .timeout(10000, { cancel: true });
    },

    getProductVariantByTitleAndShop: (title, shop) => {
        return knex('ProductVariant').select('title', 'productBaseId', 'shop', 'productVariantId', 'createdDate')
            .where('title', title)
            .where('shop', shop)
            .timeout(10000, { cancel: true });
    }
}