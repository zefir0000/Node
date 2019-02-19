const bookshelf = require('../../config/bookshelf');

const Product = bookshelf.Model.extend({
    tableName: 'ProductBase'
});

module.exports.createProductBase = (product) => {

    var createDate = new Date(Date.now()).toLocaleString();
    return new Product({
        title: product.title,
        image: product.image,
        platform: product.platform,
        topTen: product.topTen,
        description: product.description,
        createdDate: createDate

    }).save(null, { method: 'insert' }).then(function () {
        console.log('Added product base with title: ', product.title);
    })
        .catch((err) => {
            console.log('Added product base: ', product.title, ' somthing went wrong!: ', err)
        });
}
module.exports.updateProductBase = (product) => {
    console.log(product)
    updateDate = new Date(Date.now()).toLocaleString();

    return new Product({
        title: product.title,
        image: product.image,
        platform: product.platform,
        topTen: product.topTen,
        description: product.description,
        updatedDate: updateDate

    }).where('productBaseId', product.productBaseId)
        .save(null, { method: "update" }, { patch: true })
        .catch((err) => { console.log(err); return err });
};
