const express = require('express');
const router = express.Router();
const models = require('../../models')
module.exports = router;
const Hotels = models.Hotel;
const Restaurants = models.Restaurant;
const Activities = models.Activity;
const Days = models.Day;

router.get('/days/:id', function(req, res, next){
  Days.findOne({
    where : {
      number: req.params.id
    },
    include : [Hotels, Restaurants, Activities]
  })
  .then(function(dayFound){
    res.json(dayFound);
  })
  .catch(next);
});

router.get('/days', function(req, res, next){
  Days.findAll()
  .then(function(foundDays){
    res.json(foundDays);
  })
})
