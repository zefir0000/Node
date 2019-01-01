const bookshelf = require('../config/bookshelf');

const ProductsSimple = bookshelf.Model.extend({
    tableName: 'productsSimple'
});

module.exports.uploadProductFromXml = (productSimple) => {
    return new ProductsSimple({
        id: productSimple.id,        
        title: productSimple.title,
        description: productSimple.description,
    })
    .save();
};
