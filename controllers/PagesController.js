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

exports.upload = (req, res) => {
    res.render('pages/upload', {
        formMessage: req.flash('form')
    });
};

exports.search = (req, res) => {
    res.render('pages/search', {
        formMessage: req.flash('form')
    });
};
