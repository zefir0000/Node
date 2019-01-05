const bookshelf = require('../config/bookshelf');

const ProductsBase = bookshelf.Model.extend({
    tableName: 'ProductBaseGBP'
});

module.exports.uploadProductFromXml = (productBase, exist) => {
    if(exist == false){
        var methodField = 'insert'; 
        console.log('Added product witch id: ', productBase.id, ' and title: ', productBase.title);        

    } else { 
        methodField = 'update'; 
        console.log('Updated product witch id: ', productBase.id, ' and title: ', productBase.title);        
    } 
    return new ProductsBase({
        id: productBase.id,        
        title: productBase.title,
        link: productBase.link,
        image: productBase.image,
        price: productBase.price,
        availability: productBase.availability,
        shop: productBase.shop
        }).save(null, { method: methodField})
        .catch((err) => { console.log(err); err.status(400); return err });
};

