const bookshelf = require('../config/bookshelf');

const Product = bookshelf.Model.extend({
    tableName: 'ProductCatalog'
});

module.exports.createProduct = (product, exist, next) => {
    if(exist == false){
       
        console.log('Added product witch id: ', product.id, ' and title: ', product.title);        

    } else { 
        console.log('product with title: ', product.title, ' acctualy exist')
        next();
        err.status(400);
        err.massage("'product title is not unique")
    } 
    return new Product({
        id: product.id,        
        title: product.title,
        description: product.description,
        linksVideo: product.linkVideo,
        images: product.images,
        linksToPublications: product.linksToPublications,
        requirements: product.requirements,
        platform: product.platform,
        shopIds: product.shopIds
        }).save(null, { method: "insert"})
        .catch((err) => { console.log(err); err.status(400); return err });
};

module.exports.updateProduct = (product, exist, next) => {
    if(exist == true){
       
        console.log('Updated product witch id: ', product.id, ' and title: ', product.title);        

    } else { 
        console.log('product with title: ', product.id, ' acctualy not exist')
        next();
        err.status(400);
        err.massage("'Product exist with the same title")
    } 
    return new Product({
        //id: product.id,        
        title: product.title,
        description: product.description,
        linksVideo: product.linkVideo,
        images: product.images,
        linksToPublications: product.linksToPublications,
        requirements: product.requirements,
        platform: product.platform,
        shopIds: product.shopIds
        }).save(null, { method: "update"})
        .catch((err) => { console.log(err); err.status(400); return err });
};

