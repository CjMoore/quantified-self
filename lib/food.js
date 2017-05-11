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
    return $.ajax({
      url: API + 'foods',
      method: 'DELETE',
      data: newFood
    })
    .done(addToFoodTable)
    .fail( (error) => {
      console.error(error)
    })
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
    $('.foods tbody').prepend(`<tr><td>${food.name}</td><td>${food.calories}</td><td><button class='remove btn red darken-3'>-</button></td></tr>`)
  })
}

function addToFoodTable(data) {
  const food = data[0]
  $(`<tr><td>${food.name}</td><td>${food.calories}</td><td><button class='remove btn red darken-3'>-</button></td></tr>`).prependTo('.foods tbody')
  $('.error').empty().remove()
  $('input[name=food-name]').val('')
  $('input[name=food-calories]').val('')
}

function caloriesError () {
  $('#new-food').append(`<div><span class='error'>Please enter a calorie amount</span><div>`)
}
function nameError () {
  $('#name-field').append(`<span class='error'>Please enter a food name</span>`)
}



module.exports = new Food()
