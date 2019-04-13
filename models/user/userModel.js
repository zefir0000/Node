const bookshelf = require('../../config/bookshelf');

const User = bookshelf.Model.extend({
    tableName: 'Users'
});

module.exports.earnCoinUpVote = (user) => {
    return new User({
        coins: user.coins,
    }).where('name', user.name)
        .save(null, { method: "update" }, { patch: true })
        .catch((err) => { console.log(err); return err });
}

module.exports.createUser = (user) => {
    createDate = new Date(Date.now()).toLocaleString();

    return new User({
        id: user.googleId,
        locale: user.locale || null,
        name: user.name,
        image: user.image || null,
        email: user.email,
        password: user.password,
        coins: user.coins,
        createdDate: createDate

    }).save(null, { method: "insert" })
        .catch((err) => { console.log(err); return err });
}

