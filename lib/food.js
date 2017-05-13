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

  editName() {
    const toEdit = {name: $(event.target).val(), calories: $(event.target).parent().next().text()}

    const tr = $(event.target).parent().parent()
    const id = tr.data('food-id')

    $.ajax({
      url: API + `foods/${id}`,
      method: 'PATCH',
      data: toEdit
    })
    .then( (data) => {
      updateCellName(data, tr)
    })
    .fail( (error) => {
      console.error(error)
    });
  };

  editCalories() {
    const toEdit = {name: $(event.target).parent().prev().text(), calories: $(event.target).val()}


    const tr = $(event.target).parent().parent()
    const id = tr.data('food-id')
    // console.log(tr)

    $.ajax({
      url: API + `foods/${id}`,
      method: 'PATCH',
      data: toEdit
    })
    .then( (data) => {
      updateCellCalories(data, tr)
    })
    .fail( (error) => {
      console.error(error)
    });
  };
};



function makeFoodTable(data) {
  data.forEach( (food) => {
    $('.foods tbody').prepend(`<tr data-food-id=${food.id}><td class='food-cell' >${food.name}</td><td class='calorie-cell'>${food.calories}</td><td><button data-food-id=${food.id} class='remove btn red darken-3'>-</button></td></tr>`)
  })
}

function addToFoodTable(data) {
  const food = data[0]
  $(`<tr data-food-id=${food.id}><td class='food-cell'>${food.name}</td><td class='calorie-cell'>${food.calories}</td><td><button data-food-id=${food.id} class='remove btn red darken-3'>-</button></td></tr>`).prependTo('.foods tbody')
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

function updateCellName (data, tr) {
  const td = ($(tr).children()[0])
  $(td).children()[0].remove()
  $(td).text(data[0].name)
}

function updateCellCalories( data, tr) {
  const td = ($(tr).children()[1])
  $(td).children()[0].remove()
  $(td).text(data[0].calories)
}

$(document).ready(function(){
  const food = new Food
  food.getAll()

  $('.foods').on('click', '.remove', (event) => {
    food.remove()
  })

  $('.foods').on('click', '.food-cell', (event) => {
    const cellValue = $(event.target).text();
    const td = event.target
    $(td).html($('<input />',{'value' : cellValue}).val(cellValue).attr('id', cellValue))

    const cell = $(td).children()[0]

    cell.focus()

    $('table').on('focusout', cell, (event) => {
      food.editName()
    })

    $(cell).keypress( (event) => {
      if(event.which == 13) {
        food.editName()
      }
    });
  })

  $('.foods').on('click', '.calorie-cell', (event) => {
    const cellValue = $(event.target).text();
    $(event.target).html($('<input />',{'value' : cellValue}).val(cellValue).attr('id', cellValue))

    $(`#${cellValue}`).focus()

    $('table').on('focusout', `#${cellValue}`, (event) => {
      food.editCalories()
    })

    $(`#${cellValue}`).keypress( (event) => {
      if(event.which == 13) {
        food.editCalories()
      }
    });
  })

  $('#new-food').submit( (event) => food.addFood())

  $('form').on('submit', (event) => event.preventDefault());
});
