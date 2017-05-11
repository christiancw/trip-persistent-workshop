'use strict';
/* global $ dayModule */

/**
 * A module for managing multiple days & application state.
 * Days are held in a `days` array, with a reference to the `currentDay`.
 * Clicking the "add" (+) button builds a new day object (see `day.js`)
 * and switches to displaying it. Clicking the "remove" button (x) performs
 * the relatively involved logic of reassigning all day numbers and splicing
 * the day out of the collection.
 *
 * This module has four public methods: `.load()`, which currently just
 * adds a single day (assuming a priori no days); `switchTo`, which manages
 * hiding and showing the proper days; and `addToCurrent`/`removeFromCurrent`,
 * which take `attraction` objects and pass them to `currentDay`.
 */

var tripModule = (function () {

  // application state

  var days = [],
      currentDay;

  // jQuery selections

  var $addButton, $removeButton;
  $(function () {
    $addButton = $('#day-add');
    $removeButton = $('#day-title > button.remove');
  });

  // method used both internally and externally

  function switchTo (newCurrentDay) {
    if (currentDay) currentDay.hide();
    currentDay = newCurrentDay;
    currentDay.show();
  }

 // ~~~~~~~~~~~~~~~~~~~~~~~
    // before calling `addDay` or `deleteCurrentDay` that update the frontend (the UI), we need to make sure that it happened successfully on the server
  // ~~~~~~~~~~~~~~~~~~~~~~~
  $(function () {
    $addButton.on('click', addDay);
    $removeButton.on('click', deleteCurrentDay);
  });



  // ~~~~~~~~~~~~~~~~~~~~~~~
    // `addDay` may need to take information now that we can persist days -- we want to display what is being sent from the DB
  // ~~~~~~~~~~~~~~~~~~~~~~~
  function addDay () { 
    if (this && this.blur) this.blur(); // removes focus box from buttons
    // var newDay = dayModule.create({ number: days.length + 1 }); // dayModule
    var dayNum = days.length + 1;
    $.ajax({
      method: 'POST',
      url: '/days/add/' + dayNum
    }).then(function(json){
      var newDay = dayModule.create(json);
      days.push(newDay);
      if (days.length === 1) {
        currentDay = newDay;
      }
      switchTo(newDay);
    });
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~
    // Do not delete a day until it has already been deleted from the DB
  // ~~~~~~~~~~~~~~~~~~~~~~~
  function deleteCurrentDay () {
    // prevent deleting last day
    if (days.length < 2 || !currentDay) return;

    $.ajax({
      method: 'POST',
      url: '/days/' + currentDay.number + "/removeDay"
    }).then(function(json) {
      // remove from the collection
      var index = days.indexOf(currentDay),
        previousDay = days.splice(index, 1)[0],
        newCurrent = days[index] || days[index - 1];
      // fix the remaining day numbers
      var updates = [];
      days.forEach(function (day, i) {
        // ajax
        var updateAjax = $.ajax({
          method: 'PUT',
          url: '/days/update/' + day.id,
          data: {
            newNum: i + 1
          }
        });
        day.setNumber(i + 1);
        updates.push(updateAjax);
      });

      Promise.all(updates)
      .then(function(jsonArr) {
        switchTo(newCurrent);
        previousDay.hideButton();
      })
    })
  }

  // globally accessible module methods

  var publicAPI = {

    load: function () {
      console.log("LOADING DAYS");
      // ~~~~~~~~~~~~~~~~~~~~~~~
        //If we are trying to load existing Days, then let's make a request to the server for the day. Remember this is async. For each day we get back what do we need to do to it?
      // ~~~~~~~~~~~~~~~~~~~~~~~
      $.ajax({
        method: 'GET',
        url: '/days'
      }).then(function(databaseDays){
        databaseDays.forEach((day) => {
          let newDay = dayModule.create(day);
          console.log(newDay);
          days.push(newDay);
          switchTo(newDay);
        });
      })
      // $(addDay);
    },

    switchTo: switchTo,

    addToCurrent: function (attraction) {
      console.log("adding days");
      currentDay.addAttraction(attraction);
    },

    removeFromCurrent: function (attraction) {
      currentDay.removeAttraction(attraction);
    }

  };

  return publicAPI;

}());
