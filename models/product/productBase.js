const bookshelf = require('../../config/bookshelf');

const ProductsFromFile = bookshelf.Model.extend({
    tableName: 'ProductBase'
});

module.exports.createProductBase = (product) => {

        var createDate = new Date(Date.now()).toLocaleString();
        return new ProductsFromFile({
            title: product.title,
            image: product.image,
            platform: product.platform,
            description: product.description,
            createdDate: createDate
            
            }).save(null, { method: 'insert'}).then(function(){
                console.log('Added product base with title: ', product.title);        
            })
            .catch((err) => { 
                console.log('Added product base: ', product.title, ' somthing went wrong!: ', err )
            });
        }