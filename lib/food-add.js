const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL ='http://localhost:3000/api/v1/'
const $ = require('jquery')

class FoodAdd {

  addFood() {
    let form            = $('#new-food')
    let newFood         = {}
    newFood['name']     = $("input[name=food-name]").val();
    newFood['calories'] = $("input[name=food-calories]").val();
    $('.calorie-error').empty().remove()
    $('.name-error').empty().remove()

    if(newFood.name == "" && newFood.calories == "") {
      this.caloriesError()
      this.nameError()
    } else if (newFood.calories == "") {
      this.caloriesError()
    } else if (newFood.name == "" ) {
      this.nameError()
    } else {
      return $.ajax({
        url: API + 'foods',
        method: 'POST',
        data: newFood
      })
      .then((data) => {
        this.addToFoodTable(data)
      })
      .fail( (error) => {
        console.error(error)
      });
    };
  }

  caloriesError () {
     $('.calorie-error').empty().remove()
     $('#calorie-field').parent().after(`<div class='calorie-error'>Please enter a calorie amount</div>`)
   }

  nameError () {
    $('.name-error').empty().remove()
    $('#name-field').parent().after(`<div class='name-error'>Please enter a food name
     </divl>`)
  }

  addToFoodTable(data) {
    const food = data[0]
    $(`<tr data-food-id=${food.id}><td class='food-cell'>${food.name}</td><td class='calorie-cell'>${food.calories}</td><td><button data-food-id=${food.id} class='remove btn red darken-3'>-</button></td></tr>`).prependTo('.foods tbody')
    $('.calorie-error').empty().remove()
    $('.name-error').empty().remove()
    $('input[name=food-name]').val('')
    $('input[name=food-calories]').val('')
   }
}

module.exports = new FoodAdd
