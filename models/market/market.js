const bookshelf = require('../../config/bookshelf');

const Market = bookshelf.Model.extend({
    tableName: 'Market'
});

module.exports.createMarket = (market) => {
    createDate = new Date(Date.now()).toLocaleString();

    console.log('markt', market)
    return new Market({
        marketId: null,
        name: market.name,
        support: market.support,
        logo: market.logo,
        link: market.link,  
        description: market.description,
        raiting: market.raiting,
        adress: market.adress,
        createdDate: createDate,
        }).save(null, { method: "insert"})
        .catch((err) => { console.log(err); return err });
};

module.exports.updateMarket = (market) => {
    updateDate = new Date(Date.now()).toLocaleString();

    return new Market({
        name: market.name,
        suppordt: market.contact,
        logo: market.logo,
        link: market.link,  
        description: market.description,
        rating: market.rating,
        updatedDate: updateDate
        }).save(null, { method: "update"}, { patch: true })
        .where('marketId', market.marketId)
        .catch((err) => { console.log(err); err.status(400); return err });
};
