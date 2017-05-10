const API = 'https://qs-be.herokuapp.com/api/v1/'
// const LOCAL ='http://localhost:3000/api/v1/foods'

$ = require('jquery')

const Food = class Food {

  constructor () {

  }

  getAll() {
    return $.ajax({
    method: 'GET',
    url: API + 'foods',
    })
    .done(makeFoodTable)
    .fail( (error) => {
      console.error(error)
    });
  };

  remove() {
    alert("I did it")
  }
};

function makeFoodTable(data) {
  data.forEach( (food) => {
    $('.foods tbody').append(`<tr><td>${food.name}</td><td>${food.calories}</td><td><button class='remove'>-</button></td></tr>`)
  })
}



// $(document).ready(function(){
//   debugger
//   let food = new Food
//   food.getAll()
// });

module.exports = new Food()
