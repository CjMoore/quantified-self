const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL = 'http://localhost:3000/api/v1/'
const $ = require('jquery')
const diaryFoodTable = require('./diary-food-table')

function searchFoods(){
  let searchName = $('#food-filter').val()
  $('#diary-foods-body').html('')
  return $.ajax({
    url: `${API}search?searchName=${searchName}`,
    method: 'GET',
  })
  .then((data) => {
    diaryFoodTable.makeFoodTable(data)
  })
  .fail( (error) => {
    console.error(error)
  })
}

$(document).ready(function(){

  $('#food-filter').on('input',function(){
    searchFoods()
  })

  $('form').on('submit', (event) => event.preventDefault());
});
