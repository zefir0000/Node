const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const dealModel = require('../models/deal/deal')
const userModel = require('../models/user/userModel')
const fingerprintModel = require('../models/fingerprint/fingerprintModel')
const dateOperation = require('../helper/DateOperation');


module.exports = {

    getDeals: () => {
        return knex.from('Deal').orderBy([{ column: 'updatedDate', order: 'desc' }])
            .limit(25)
    },

    getUserDeals: (userId) => {
        return knex.from('Deal')
            .where('user', userId)
    },

    upVote: (dealId, hash) => {
        console.log(hash)
        return knex.from('Fingerprint').where('fingerprint', hash.fingerprint).then((data) => {

            if (JSON.stringify(data) == '[]') {
                return fingerprintModel.newFingerprint({
                    'fingerprint': hash.fingerprint
                }).then(() => {
                    return fingerprintModel.upVote(hash.fingerprint).then(() => {
                        return knex.from('Deal').where('dealId', dealId).then((deal) => {
                            var upVote = deal[0].upVote + 1
                            dealModel.upVoteDeal({
                                'dealId': dealId,
                                'upVote': upVote
                            })
                            if (deal[0].user != "Guest") {
                                return knex.from('Users').where('name', deal[0].user).then((user) => {
                                    var coins = user[0].coins + 3
                                    userModel.earnCoinUpVote({
                                        'name': user[0].name,
                                        'coins': coins
                                    })
                                })
                            }
                        })
                    })
                })
            } else {
                if (dateOperation.days(data[0].upVote) > 1) {
                    return fingerprintModel.upVote(hash.fingerprint).then(() => {
                        return knex.from('Deal').where('dealId', dealId).then((deal) => {
                            var upVote = deal[0].upVote + 1
                            dealModel.upVoteDeal({
                                'dealId': dealId,
                                'upVote': upVote
                            })
                            if(deal[0].user != "Guest"){
                                return knex.from('Users').where('name', deal[0].user).then((user) => {
                                    var coins = user[0].coins + 3
                                    userModel.earnCoinUpVote({
                                        'name': user[0].name,
                                        'coins': coins
                                    })
                                })
                            }
                        })
                    })
                } else { return { hours: dateOperation.hours(data[0].upVote)} }
            }
        })
    },

    createDealByUser: (body) => {
        const ernedCoins = 10;
        var fingerprint = body.fingerprint
        var deal = body.deal
        return knex.from('Fingerprint').where('fingerprint', fingerprint).then((data) => {
            // if fingerprint not exist
            if (JSON.stringify(data) == '[]') {
                // create fingrprint
                return fingerprintModel.newFingerprint({
                    'fingerprint': fingerprint
                }).then(() => {
                    // and add deal
                    return fingerprintModel.addDeal(fingerprint).then(() => {
                        return dealModel.createDeal({
                            'user': deal.user,
                            'title': deal.title,
                            'link': deal.link,
                            'price': deal.price,
                            'currency': deal.currency
                        }).then(() => {
                            knex.from('Users').where('name', deal.user).then((user) => {
                                var coins = user[0].coins + ernedCoins
                                userModel.earnCoinUpVote({
                                    'name': user[0].name,
                                    'coins': coins
                                })
                                return { user: user[0].name, coins: ernedCoins }
                            })
                        })
                    })
                })
                // else fingerprint exist
            } else {
                // check date deal for fingerprint 
                if (dateOperation.days(data[0].addDeal) > 1) {
                    //if date is older than one day add deal and update date
                    return fingerprintModel.addDeal(fingerprint).then(() => {
                        return dealModel.createDeal({
                            'user': deal.user,
                            'title': deal.title,
                            'link': deal.link,
                            'price': deal.price,
                            'currency': deal.currency
                        }).then(() => {
                            knex.from('Users').where('name', deal.user).then((user) => {
                                var coins = user[0].coins + ernedCoins
                                userModel.earnCoinUpVote({
                                    'name': user[0].name,
                                    'coins': coins
                                })
                                return { user: user[0].name, coins: ernedCoins }
                            })
                        })
                    })
                    // else return info
                } else { return { hours: dateOperation.hours(data[0].addDeal) } }
            }
        })
    },

    createDealByGuest: (body) => {
        var fingerprint = body.fingerprint
        var deal = body.deal

        return knex.from('Fingerprint').where('fingerprint', fingerprint).then((data) => {
            // if fingerprint not exist
            if (JSON.stringify(data) == '[]') {
                // create fingrprint
                return fingerprintModel.newFingerprint({
                    'fingerprint': fingerprint
                }).then(() => {
                    // and add deal
                    return fingerprintModel.addDeal(fingerprint).then(() => {
                        return dealModel.createDeal({
                            'user': "Guest",
                            'title': deal.title,
                            'link': deal.link,
                            'price': deal.price,
                            'currency': deal.currency
                        })
                    })
                })
                // else fingerprint exist
            } else {
                // check date deal for fingerprint 
                if (dateOperation.days(data[0].addDeal) > 1) {
                    //if date is older than one day add deal and update date
                    return fingerprintModel.addDeal(fingerprint).then(() => {
                        return dealModel.createDeal({
                            'user': "Guest",
                            'title': deal.title,
                            'link': deal.link,
                            'price': deal.price,
                            'currency': deal.currency
                        })

                    })
                    // else return info
                } else { return { hours: dateOperation.hours(data[0].addDeal) } }
            }
        })
    }
}
