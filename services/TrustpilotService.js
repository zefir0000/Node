const axios = require('axios')
const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

const marketModel = require('../models/market/market')

module.exports = {
    updateTrustpilot: async () => {
        var markets = await knex.from('Market')
        var i = markets.length
        do {
            await axios.get(markets[--i].raiting)
                .then(response => {
                    var products = response.data;
                    var begin = products.indexOf('<script type="application/ld+json" data-business-unit-json-ld>')
                    var string = (products.substring(begin + 62));
                    var end = string.indexOf('</script>');
                    var final = JSON.parse(string.substring(0, end - 10));

                    marketModel.updateTrustpilotMarket({
                        ratingValue: final[0].aggregateRating.ratingValue * 10, 
                        reviewCount: final[0].aggregateRating.reviewCount,
                        marketId: markets[i].marketId
                    })
                }).catch((err) => { console.log(err) })
        } while (i > 0)
    }
}