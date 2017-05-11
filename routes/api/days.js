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
  Days.findAll({
    include: [Hotels, Restaurants, Activities]
  })
  .then(function(foundDays){
    console.log(foundDays);
    res.json(foundDays);
  })
  .catch(next);
});

router.post('/days/add/:id', function(req, res, next) {
  let dayNum = req.params.id;
  Days.create({
    number: dayNum
  }).then(function(day){
    res.status(201).json(day);
  }).catch(next);
});

router.post('/days/:id/remove', function(req, res, next) {
  let type = req.body.type;
  console.log(type);
  switch(type){
    case "hotel":
      removeHotel(req.params.id, res, next);
      break;
    case "restaurant":
      removeRestaurant(req.params.id, req.body.id, res, next);
      break;
    case "activity":
      removeActivity(req.params.id, req.body.id, res, next);
      break;
    default:
      res.status(404).send("Invalid attraction type: " + type);
  }
});

function removeHotel(dayNum, res, next){
   Days.update({
    hotelId: null
  }, {
    where: {
      number: dayNum
    }
  }).then(function(day) {
    res.status(201).json(day);
  }).catch(next); 
}

function removeRestaurant(dayNum, restaurantId, res, next) {
  var day;
  Days.findOne({
    where: {
      number: dayNum
    }
  })
  .then(function(databaseDay){
    day = databaseDay;
    return Restaurants.findById(restaurantId);
  })
  .then(function(restaurant) {
    return day.removeRestaurant(restaurant, {through: "RestaurantDay"});
  })
  .then(function(restaurantDay){
    res.json(restaurantDay);
  })
  .catch(next);
}

function removeActivity(dayNum, activityId, res, next) {
  var day;
  Days.findOne({
    where: {
      number: dayNum
    }
  })
  .then(function(databaseDay){
    day = databaseDay;
    return Activities.findById(activityId);
  })
  .then(function(activity) {
    return day.removeActivity(activity, {through: "ActvityDay"});
  })
  .then(function(activityDay){
    res.json(activityDay);
  })
  .catch(next);
}

router.post('/days/:id/:type', function(req, res, next) {
  let type = req.params.type;
  switch(type){
    case "hotel":
      // send hotelId in req.body
      linkNewHotel(req.params.id, req.body, res, next);
      break;
    case "restaurant":
      linkNewRestaurant(req.params.id, req.body, res, next);
      break;
    case "activity":
      linkNewActivity(req.params.id, req.body, res, next);
      break;
    default:
      res.status(404).send("Invalid attraction type: " + type);
  }
});

function linkNewHotel(dayNum, info, res, next){
  Days.update({
    hotelId: info.id
  }, {
    where: {
      number: dayNum
    }
  }).then(function(day) {
    res.status(201).json(day);
  }).catch(next);
}

function linkNewRestaurant(dayNum, info, res, next) {
  var day;
  Days.findOne({
    where: {
      number: dayNum
    }
  })
  .then(function(databaseDay){
    day = databaseDay;
    return Restaurants.findById(info.id);
  })
  .then(function(restaurant) {
    return day.addRestaurant(restaurant, {through: "RestaurantDay"});
  })
  .then(function(restaurantDay){
    res.json(restaurantDay);
  })
  .catch(next);
}

function linkNewActivity(dayNum, info, res, next) {
  var day;
  Days.findOne({
    where: {
      number: dayNum
    }
  })
  .then(function(databaseDay){
    day = databaseDay;
    return Activities.findById(info.id);
  })
  .then(function(activity) {
    return day.addActivity(activity, {through: "ActvityDay"});
  })
  .then(function(activityDay){
    res.json(activityDay);
  })
  .catch(next);
}
