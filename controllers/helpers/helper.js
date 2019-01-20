const axios = require('axios');

exports.getProductsFromG2A = () => {
    const g2aProducts = axios.create({
        headers: {
            'Authorization': 'qdaiciDiyMaTjxMt, 74026b3dc2c6db6a30a73e71cdb138b1e1b5eb7a97ced46689e2d28db1050875'
        }
    })

    const getItems = async () => {
        return await g2aProducts.get('https://sandboxapi.g2a.com/v1/products?page=1');
      }

       (async () => {
        await getItems();
        return items;
      })();
}

function getProductId(productId, shop) {

        return knex('ProductsFromShopsUSD')
                .where('productId', productId)
                .where('shop', shop)
                .timeout(1000, { cancel:true });
            };