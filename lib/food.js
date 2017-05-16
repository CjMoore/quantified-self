const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL ='http://localhost:3000/api/v1/'
const $ = require('jquery')
const FoodRemove = require('./food-remove')
const FoodAdd = require('./food-add')
const FoodTable = require('./food-table')
require('./edit-food')

const Food = class Food {

  constructor () {
    FoodTable.getAll()

    $('.foods').on('click', '.remove', (event) => {
      FoodRemove.remove()
    })

    $('#new-food').submit( (event) => FoodAdd.addFood())

    $('form').on('submit', (event) => event.preventDefault());
  }

  searchFoods(){
    let searchName = $('#food-filter').val()
    $('.foods tbody').html('')
    return $.ajax({
      url: `${API}search?searchName=${searchName}`,
      method: 'GET',
    })
    .then( (data) => {
      FoodTable.makeFoodTable(data)
    })
    .fail( (error) => {
      console.error(error)
    })
  }
};


$(document).ready(function(){
  const food = new Food

  $('#food-filter').on('input',function(){
    food.searchFoods()
  })

  $('form').on('submit', (event) => event.preventDefault());
});
