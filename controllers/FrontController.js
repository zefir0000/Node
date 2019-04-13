const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const random = require('../helper/Random');
const dateOperation = require('../helper/DateOperation');
const TopTenService = require('../services/TopTenService');
const ProductService = require('../services/ProductService');
const DealService = require('../services/DealService');
const UserService = require('../services/UserService');

exports.getMems = (req, res) => {
    knex.from('Mems').then(function (data) {
        let lengthMem = data.length - 1
        randomMem = random(0, lengthMem)
        res.json(data[randomMem])
        res.statusCode = 200;
    });
};

exports.getTopTen = (req, res) => {
    TopTenService.getTopTen().then((data) => {
        res.statusCode = 200
        res.json(data)
    })
};

exports.getProductBase = (req, res) => {
    var name = req.query.name;
    var currency = req.query.currency;
    var title = name.replace(/ /g, "%")

    ProductService.searchProductBase(title, currency).then((data) => {
        res.statusCode = 200;
        res.json(data)
    })
};

exports.getProductWithOffer = (req, res) => {
    ProductService.getProductBaseById(req.query.id).then((productBaseData) => {
        ProductService.getProductOfferForProductBase(req.query.id).then((productOfferData) => {
            res.statusCode = 200;
            var result = Object.assign({ productBaseData }, { productOfferData });
            res.json(result)
        })
    })
};

exports.getDeals = (req, res) => {
    DealService.getDeals().then((deals) => {
        res.statusCode = 200;
        res.json(deals)
    })
};

exports.upVote = (req, res) => {
    DealService.upVote(req.params.dealId, req.body).then((data) => {
        res.statusCode = 200;
        res.json(data)
    })
};

exports.getUser = (req, res) => {
    UserService.getUser(req.params.userId).then((user) => {
        res.statusCode = 200;
        res.json(user[0])
    })
};

exports.getUserDeals = (req, res) => {
    DealService.getUserDeals(req.query.name).then((deals) => {
        res.statusCode = 200;
        res.json(deals)
    })
};

exports.getUserByEmail = (req, res) => {
    UserService.getUserByEmail(req.params.email).then((user) => {
        res.statusCode = 200;
        res.json(user[0])
    })
}

exports.createDealByUser = async (req, res, next) => {
    DealService.createDealByUser(req.body).then(() => {
        res.statusCode = 201
        res.send(response)

    })
}

exports.createDealByGuest = async (req, res, next) => {
    DealService.createDealByGuest(req.body).then((response) => {
        res.statusCode = 201
        res.send(response)

    })
}

exports.getUsers = (req, res) => {
    UserService.getUsers().then((users) => {
        var length = users.length
        for (var i = 0; i < length; i++) {
            users[i].createdDate = dateOperation.days(users[i].createdDate)
        }
        res.statusCode = 200;
        res.json(users)
    })
};

exports.createUser = (req, res) => {
    UserService.createUser(req.body).then(() => {
        res.statusCode = 204;
        res.json('OK')
    })
};

exports.createAccount = (req, res) => {
    // validacja server
    UserService.createAccount(req.body).then(() => {
        res.statusCode = 204;
        res.json('OK')
    })
};


