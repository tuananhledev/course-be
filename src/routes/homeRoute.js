const router = require('express').Router();
const {scraperHome} = require('../puppeteer/scraper'); 

router.get('/home',async (req, res) => {
   try {
      const response = await scraperHome()

      res.status(200).json(response);
   } catch (error) {
      res.status(500).json(error)
   }
});

module.exports = router;