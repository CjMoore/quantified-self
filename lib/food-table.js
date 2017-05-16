const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL ='http://localhost:3000/api/v1/'
const $ = require('jquery')

class FoodTable {

  getAll() {
    return $.ajax({
    method: 'GET',
    url: API + 'foods',
    })
    .then( (data) => {
      this.makeFoodTable(data)
    })
    .fail( (error) => {
      console.error(error)
    });
  };

  makeFoodTable(data) {
    data.forEach( (food) => {
      $('.foods tbody').prepend(`<tr data-food-id=${food.id}><td class='food-cell' >${food.name}</td><td class='calorie-cell'>${food.calories}</td><td><button data-food-id=${food.id} class='remove btn red darken-3'>-</button></td></tr>`)
    })
  }
}

module.exports = new FoodTable
