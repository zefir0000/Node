const bookshelf = require('../../config/bookshelf');

const ProductsFromFile = bookshelf.Model.extend({
    tableName: 'ProductVariant'
});

module.exports.createProductVariant = (product) => {
    var createDate = new Date(Date.now()).toLocaleString();
    
    return new ProductsFromFile({
        productBaseId: product.productBaseId,
        title: product.title,
        link: product.link,
        productShopId: product.productShopId,
        price: product.price,
        currency: product.currency,
        availability: product.availability,
        shop: product.shop,
        createdDate: createDate

    }).save(null, { method: 'insert' }).then(function () {
        //console.log('Added product variant with title: ', product.title, ' from shop: ', product.shop);
    })
        .catch((err) => {
            console.log('Added product variant: ', product.title, ' somthing went wrong!: ', err)
        });
}

module.exports.updateProductVariant = (product) => {
    var updateDate = new Date(Date.now()).toLocaleString();
    
    return new ProductsFromFile({
        productBaseId: product.productBaseId,
        link: product.link,
        productShopId: product.productShopId,
        price: product.price,
        currency: product.currency,
        availability: product.availability,
        updatedDate: updateDate

    }).where('productVariantId', product.productVariantId).save(null, { method: 'update' }, { patch: true }).then(function () {
        //console.log('Update product variant with title: ', product.title, ' from shop: ', product.shop);
    })
        .catch((err) => {
            console.log('Update product variant: ', product.title, ' somthing went wrong!: ', err)
        });
}
