const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

module.exports = {
    list: async(url) => {

        var name = require('url').parse(url,true).query.name;

        return knex.from('ProductBaseGBP')
            .where('title', 'like', name + '%')
            .andWhereRaw(`availability = "in stock"`)
            .then(function(SQLProducts){

                return SQLProducts
            });
    }
}


