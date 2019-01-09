const bookshelf = require('../config/bookshelf');

const Shop = bookshelf.Model.extend({
    tableName: 'Shops'
});

module.exports.createShop = (shop) => {
   
    return new Shop({
        id: shop.id,    
        name: shop.name,
        contact: shop.contact,
        confirmed: shop.confirmed,
        imagelink: shop.imagelink,
        link: shop.link,  
        description: shop.description,
        rating: shop.rating,
        supportTime: shop.supportTime,
        supportLang

        }).save(null, { method: "insert"})
        .catch((err) => { console.log(err); err.status(400); return err });
};
