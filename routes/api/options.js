const express = require('express');
const router = express.Router();
const models = require('../../models')
module.exports = router;
const Hotels = models.Hotel;
const Restaurants = models.Restaurant;
const Activities = models.Activity;

router.get('/options', function(req, res, next){
  Promise.all([Restaurants.findAll(), Hotels.findAll(), Activities.findAll()])
  .then(function(foundAttractions){
    let result = {restaurants: foundAttractions[0],
    hotels: foundAttractions[1], activities: foundAttractions[2]};
    res.json(result);
  })
  .catch(next);
});

router.post('/add/:typeOfAttraction', function(req, res, next){
  res.send('this is the post route');
})
