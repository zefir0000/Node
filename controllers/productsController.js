const productsService = require("../services/productsService");

module.exports = {
    search: async(req, res) => {
      const result = await productsService.list(req.url);
      console.log('controller', result);
  
      res.json(result);
    }
}