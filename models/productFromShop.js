const bookshelf = require('../config/bookshelf');

const ProductsFromFile = bookshelf.Model.extend({
    tableName: 'ProductsFromShopsUSD'
});

module.exports.uploadProductFromShop = (product, productExist) => {
    if(JSON.stringify(productExist) == "[]") {
        
        var createDate = new Date(Date.now()).toLocaleString();
        return new ProductsFromFile({
            productId: product.productId,        
            title: product.title,
            link: product.link,
            imageLink: product.imageLink,
            price: product.price,
            currency: product.currency,
            availability: product.availability,
            shop: product.shop,
            brand: product.brand,
            description: product.description,
            createdDate: createDate
            
            }).save(null, { method: 'insert'}).then(function(){
                console.log('Added product witch id: ', product.productId, ' and title: ', product.title);        
            })
            .catch((err) => { 
                console.log('Added: ', product.productId, ' somthing went wrong!: ', err )
            });

    } else { 
        updateDate = new Date(Date.now()).toLocaleString();
        return new ProductsFromFile({

            id: productExist[0].id,
            productId: product.productId,        
            title: product.title,
            link: product.link,
            imageLink: product.imageLink,
            price: product.price,
            currency: product.currency,
            availability: product.availability,
            shop: product.shop,
            brand: product.brand,
            description: product.description,
            createdDate: productExist[0].createdDate,
            updatedDate: updateDate

        }).save(null, { method: 'update'}, { patch: true }).then(function(){
                console.log('Updated product witch id: ', product.productId, ' and title: ', product.title);   
            })
            .catch((err) => { 
                console.log('Updated: ', product.productId, ' somthing went wrong!: ', err); 
            }); 
        
    };
};
