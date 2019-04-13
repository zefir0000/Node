const dbConfig = require('../config/dbConfig')

exports.createUser = (req, res) => {
    res.json(req.body);
};

exports.home = (req, res) => {
    res.render('home', {
        formMessage: req.flash('form')
    });
};

exports.contact = (req, res) => {
    res.render('pages/contact', {
        formMessage: req.flash('form')
    });
};