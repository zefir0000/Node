const bookshelf = require('../../config/bookshelf');

const Fingerprint = bookshelf.Model.extend({
    tableName: 'Fingerprint'
});

module.exports.newFingerprint = (data) => {
    createDate = new Date(Date.now()).toLocaleString();
    return new Fingerprint({
        fingerprint: data.fingerprint,
    }).save(null, { method: "insert" })
        .catch((err) => { console.log(err); return err });
};

module.exports.upVote = (fingerprint) => {
    upVoteDate = new Date(Date.now()).toLocaleString();
    return new Fingerprint({
        upVote: upVoteDate
    }).where('fingerprint', fingerprint)
    .save(null, { method: "update" }, { patch: true })
    .catch((err) => { console.log(err); return err });
};

module.exports.addDeal = (fingerprint) => {
    addDealDate = new Date(Date.now()).toLocaleString();
    return new Fingerprint({
        addDeal: addDealDate
    }).where('fingerprint', fingerprint)
    .save(null, { method: "update" }, { patch: true })
    .catch((err) => { console.log(err); return err });
};