const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL ='http://localhost:3000/api/v1/'
$ = require('jquery')

const Food = class Food {

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

  addFood() {
    let newFood         = {}
    newFood['name']     = $("input[name=food-name]").val();
    newFood['calories'] = $("input[name=food-calories]").val();

    console.log(newFood)
    if(newFood.name == "" && newFood.calories == "") {

    } else if (newFood.calories == "") {
      caloriesError()
    } else if (newFood.name == "" ) {
      nameError()
    } else {
      return $.ajax({
        url: API + 'foods',
        method: 'POST',
        data: newFood
      })
      .done(addToFoodTable)
      .fail( (error) => {
        console.error(error)
      })
    }
  }
};

function makeFoodTable(data) {
  data.forEach( (food) => {
    $('.foods tbody').append(`<tr><td>${food.name}</td><td>${food.calories}</td><td><button class='remove'>-</button></td></tr>`)
  })
}

function addToFoodTable(data) {
  $('.error').empty().remove()
  const food = data[0]
  $('.foods tbody').append(`<tr><td>${food.name}</td><td>${food.calories}</td><td><button class='remove'>-</button></td></tr>`)
  $('input[name=food-name]').val('')
  $('input[name=food-calories]').val('')
}

function caloriesError () {
  $('#new-food').append(`<span class='error'>Please enter a calorie amount</span>`)
}
function nameError () {
  $('#new-food').append(`<span class='error'>Please enter a food name</span>`)
}



module.exports = new Food()
