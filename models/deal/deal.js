const bookshelf = require('../../config/bookshelf');

const Deal = bookshelf.Model.extend({
    tableName: 'Deal'
});

module.exports.createDeal = (deal) => {
    createDate = new Date(Date.now()).toLocaleString();

    return new Deal({
        dealId: null,
        user: deal.user,
        title: deal.title,
        link: deal.link,
        currency: deal.currency,
        price: deal.price,
        image: deal.image,
        upVote: 0,
        updatedDate: createDate,
        createdDate: createDate
    }).save(null, { method: "insert" })
        .catch((err) => { console.log(err); return err });
};

module.exports.updateDeal = (deal) => {
    updateDate = new Date(Date.now()).toLocaleString();
    return new Deal({
        user: deal.user,
        title: deal.support,
        link: deal.link,
        price: deal.price,
        currency: deal.currency,
        image: deal.image,
        updatedDate: updateDate
    }).where('dealId', deal.dealId)
        .save(null, { method: "update" }, { patch: true })
        .catch((err) => { console.log(err); return err });
};

module.exports.upVoteDeal = (deal) => {
    updateDate = new Date(Date.now()).toLocaleString();
    return new Deal({
        upVote: deal.upVote,
        updatedDate: updateDate
    }).where('dealId', deal.dealId)
        .save(null, { method: "update" }, { patch: true })
        .catch((err) => { console.log(err); return err });
};
