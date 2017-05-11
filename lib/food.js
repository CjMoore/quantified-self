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
    const button = event.target
    const id = $(button).data("food-id")

    return $.ajax({
      url: API + `foods/${id}`,
      method: 'DELETE',
    })
    .done(removeFromFoodTable(button))
    .fail( (error) => {
      console.error(error)
    })
  }

  addFood() {
    let form            = $('#new-food')
    let newFood         = {}
    newFood['name']     = $("input[name=food-name]").val();
    newFood['calories'] = $("input[name=food-calories]").val();
    $('.calorie-error').empty().remove()
    $('.name-error').empty().remove()

    if(newFood.name == "" && newFood.calories == "") {
      caloriesError()
      nameError()
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
      });
    };
  };
};

function makeFoodTable(data) {
  data.forEach( (food) => {
    $('.foods tbody').prepend(`<tr><td >${food.name}</td><td>${food.calories}</td><td><button data-food-id=${food.id} class='remove btn red darken-3'>-</button></td></tr>`)
  })
}

function addToFoodTable(data) {
  const food = data[0]
  $(`<tr><td>${food.name}</td><td>${food.calories}</td><td><button data-food-id=${food.id} class='remove btn red darken-3'>-</button></td></tr>`).prependTo('.foods tbody')
  $('.calorie-error').empty().remove()
  $('.name-error').empty().remove()
  $('input[name=food-name]').val('')
  $('input[name=food-calories]').val('')
}

function removeFromFoodTable(button) {
  $(button).parent().parent().empty().remove()
}

function caloriesError () {
  $('.calorie-error').empty().remove()
  $('#calorie-field').parent().after(`<div class='calorie-error'>Please enter a calorie amount</div>`)
}
function nameError () {
  $('.name-error').empty().remove()
  $('#name-field').parent().after(`<div class='name-error'>Please enter a food name
</divl>`)
}

$(document).ready(function(){
  const food = new Food
  food.getAll()

  $('.foods').on('click', '.remove', (event) => {
    food.remove()
  })

  $('#new-food').submit( (event) => food.addFood())

  $('form').on('submit', (event) => event.preventDefault());
});
