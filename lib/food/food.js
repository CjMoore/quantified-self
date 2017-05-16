const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL ='http://localhost:3000/api/v1/'
const $ = require('jquery')
const FoodRemove = require('./food-remove')
const FoodAdd = require('./food-add')
const FoodTable = require('./food-table')
require('./edit-food')
require('./food-search')

const Food = class Food {
  constructor () {
    FoodTable.getAll()
    this.foodListeners()
  }

  foodListeners () {
    $('.foods').on('click', '.remove', (event) =>
      FoodRemove.remove()
    )

    $('#new-food').submit( (event) => FoodAdd.addFood() )

    $('form').on('submit', (event) => event.preventDefault());
  }

};

$(document).ready(function(){
  const food = new Food

  $('form').on('submit', (event) => event.preventDefault());
});
