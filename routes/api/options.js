const express = require('express');
const router = express.Router();
const models = require('../../models')
module.exports = router;
const Hotels = models.Hotel;
const Restaurants = models.Restaurant;
const Activities = models.Activity;

router.get('/options', function(req, res, next){
  Restaurants.findAll()
  .then(function(foundRestaurants){
    res.json(foundRestaurants);
  })
  .catch(next);
});

router.post('/add/:typeOfAttraction', function(req, res, next){
  res.send('this is the post route');
})
