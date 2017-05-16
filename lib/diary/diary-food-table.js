const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL ='http://localhost:3000/api/v1/'
const $ = require('jquery')


function  getFoods() {
  return $.ajax({
  method: 'GET',
  url: API + 'foods',
  })
  .then((data) => {
    makeFoodTable(data)
  })
  .fail( (error) => {
    console.error(error)
  })
}


function makeFoodTable(data) {
  data.forEach( (food) => {
    $('#diary-foods-body').prepend(`<tr data-food-id=${food.id}><td class='food-cell' >${food.name}</td><td class='calorie-cell'>${food.calories}</td><td><input type="checkbox" id="${food.id}" data-food-name="${food.name}"/><label for="${food.id}"></label></td></tr>`)
  })
}

module.exports = {getFoods: getFoods, makeFoodTable: makeFoodTable}
