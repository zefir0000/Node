const axios = require('axios');
const fs = require('fs');

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
        console.log('helper',items.data.docs[0].id);
        console.log('helper response',items.data.docs[0].id);
        return items;
      })();


      console.log("asd", asd);



// do { rejected!!!!
//     function getitems {

//         while(quantity >0){

//         function getid(){

//             if(){

//             function add {
//                 model
//             }
//             else {
//             function update {
//                 model
//             }
//         }
//     }
}