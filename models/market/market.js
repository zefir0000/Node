const bookshelf = require('../../config/bookshelf');

const Market = bookshelf.Model.extend({
    tableName: 'Market'
});

module.exports.createMarket = (market) => {
   
    return new Market({
        name: market.name,
        suppordt: market.contact,
        logo: market.logo,
        link: market.link,  
        description: market.description,
        rating: market.rating,
        }).save(null, { method: "insert"})
        .catch((err) => { console.log(err); err.status(400); return err });
};

module.exports.updateMarket = (market) => {
   
    return new Market({
        name: market.name,
        suppordt: market.contact,
        logo: market.logo,
        link: market.link,  
        description: market.description,
        rating: market.rating,
        }).save(null, { method: "update"}, { patch: true })
        .where('marketId', market.marketId)
        .catch((err) => { console.log(err); err.status(400); return err });
};
