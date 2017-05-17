const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL = 'http://localhost:3000/api/v1/'
const $ = require('jquery')
const calories = require('./calories')

  function addMeal() {
    const card = $(event.target).parent()
    const table = card.children()[12]
    const checked = $('#diary-foods-body input:checked')
    const diaryId = $('#date-box').data('diary-id')
    const meal = event.target.id

    $(checked).each( (i, obj) => {
      const newMeal = {name: meal, diaryId: diaryId, foodId: obj.id}
      $.ajax ({
        url: API + 'meals',
        method: 'POST',
        data: newMeal
      }).then( (data) => {
        grabFood(data)
      })
      .fail( (error) => {
        console.error(error)
      });
    })
  }

  function grabFood(data) {
    const mealName = data.name
    let meal_id = data.id
    $.ajax({
      url: API + `foods/${data.food_id}`,
      method: 'GET',
    }).then ((data) => {
      addFoodToMeal(data, mealName, meal_id)
    })
    .fail( (error) => {
      console.error(error)
    });
  }

  function addFoodstoMealTable(meal, mealName){
    if (Array.isArray(meal.foods)) {
      meal.foods.forEach( (food) => {
        $(`#${mealName}-body`).prepend(`<tr><td >${food.name}</td><td id='${mealName}-calories'>${food.calories}</td><td><button data-meal-id=${food.meal_id} class='remove btn red darken-3'>-</button></td></tr>`)
        calories.updateMealTotalCalories(mealName, food)
        calories.updateMealRemainingCalories(mealName, food)
      })
      calories.updateConsumedCalories()
    }
  }

  function addFoodToMeal(data, mealName, meal_id){
    $(`#${data.id}`).prop('checked',false);
    const label = $(`#${data.id}`).next()
    $(label).prop('checked', false)
    $(`#${mealName}-body`).prepend(`<tr><td >${data.name}</td><td id='${mealName}-calories'>${data.calories}</td><td><button data-meal-id=${meal_id} class='remove btn red darken-3'>-</button></td></tr>`)
    calories.updateMealTotalCalories(mealName, data)
    calories.updateMealRemainingCalories(mealName, data)
    calories.updateRemainingCalories()
    calories.updateConsumedCalories()
  }

  $(document).ready( () => {

      $('#Breakfast').on('click', (event) => {
        addMeal()
      })
      $('#Lunch').on('click', (event) => {
        addMeal()
      })
      $('#Dinner').on('click', (event) => {
        addMeal()
      })
      $('#Snacks').on('click', (event) => {
        addMeal()
      })
    $('form').on('submit', (event) => event.preventDefault());
  });

  module.exports = {addMeal: addMeal,
                    grabFood: grabFood,
                    addFoodstoMealTable: addFoodstoMealTable,
                    addFoodToMeal: addFoodToMeal}
