const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);
const userModel = require('../models/user/userModel')

module.exports = {
    getUser: (userId) => {
        return knex.select('id', 'name', 'image', 'email', 'coins').from('Users')
            .where('id', userId)
    },
    getUsers: () => {
        return knex.select('id', 'name', 'email', 'coins', 'createdDate').from('Users').orderBy('coins', 'desc')
            .limit(10)
    },
    getUserByEmail: (email) => {
        return knex.select('id', 'name', 'image', 'email', 'coins', 'password').from('Users')
            .where('email', email)
    },
    createUser: (profile) => {
        return userModel.createUser({
            'googleId': profile.id,
            'locale': profile._json.locale,
            'name': profile.displayName,
            'image': profile._json.picture,
            'coins': 0
        })
    },
    createAccount: (profile) => {
        return userModel.createUser({
            'googleId': profile.email,
            'email': profile.email,
            'name': profile.user,
            'password': profile.password,
        })
    }
}