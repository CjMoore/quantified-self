const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL = 'http://localhost:3000/api/v1/'
const diaryFoodTable = require('./diary-food-table')
const calories = require('./calories')
$ = require('jquery')

let counter = 0


const Diary = class Diary {

  getDiary() {
    let todaysDate = new Date
    let formattedDate = todaysDate
    let diaryDay = formattedDate.getDate()
    let diaryMonth = formattedDate.getMonth() + 1
    let diaryYear = formattedDate.getFullYear()

    formattedDate = `${diaryYear}-0${diaryMonth}-0${diaryDay}`
    todaysDate = todaysDate.toDateString().slice(4)
    const dateObject = {date: formattedDate}
    const date = `<div class='row'><div class='col s6 offset-s3' id='date-box'><button class='btn' id='prev-page-btn'><</button><h3 id='date-display'>${todaysDate}</h3><button class='btn' id='next-page-btn'>></button></div></div>`

    $('#date-container').append(date)

    return $.ajax({
      url: API + 'diaries/meals',
      method: 'GET',
      data: dateObject
    })
    .then((data) =>{
      populateMealsTables(data)
    })
    .fail( (error) => {
      console.error(error)
    })
  }

  addMeal() {
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

  getPrevious() {
    let todaysDate = new Date
    todaysDate.setDate(todaysDate.getDate() + counter)

    let formattedDate = todaysDate
    let diaryDay = formattedDate.getDate()
    let diaryMonth = formattedDate.getMonth() + 1
    let diaryYear = formattedDate.getFullYear()

    formattedDate = `${diaryYear}-0${diaryMonth}-0${diaryDay}`
    todaysDate = todaysDate.toDateString().slice(4)
    const dateObject = {date: formattedDate}
    const date = `<div class='row'><div class='col s6 offset-s3' id='date-box'><button class='btn' id='prev-page-btn'><</button><h3 id='date-display'>${todaysDate}</h3><button class='btn' id='next-page-btn'>></button></div></div>`

    $('#Lunch-body').empty()
    $('#Dinner-body').empty()
    $('#Snacks-body').empty()
    $('#Breakfast-body').empty()

    calories.resetCalories()

    $('#date-container').empty()
    $('#date-container').append(date)

    return $.ajax({
      url: API + 'diaries/meals',
      method: 'GET',
      data: dateObject
    })
    .then((data) => {
      populateMealsTables(data)
    })
    .fail( (error) => {
      console.error(error)
    })
  }

  getNext() {
    let todaysDate = new Date
    todaysDate.setDate(todaysDate.getDate() + counter)

    let formattedDate = todaysDate
    let diaryDay = formattedDate.getDate()
    let diaryMonth = formattedDate.getMonth() + 1
    let diaryYear = formattedDate.getFullYear()

    formattedDate = `${diaryYear}-0${diaryMonth}-0${diaryDay}`
    todaysDate = todaysDate.toDateString().slice(4)
    const dateObject = {date: formattedDate}
    const date = `<div class='row'><div class='col s6 offset-s3' id='date-box'><button class='btn' id='prev-page-btn'><</button><h3 id='date-display' class='center'>${todaysDate}</h3><button class='btn' id='next-page-btn'>></button></div></div>`

    $('#Lunch-body').empty()
    $('#Dinner-body').empty()
    $('#Snacks-body').empty()
    $('#Breakfast-body').empty()

    calories.resetCalories()

    $('#date-container').empty()
    $('#date-container').append(date)

    return $.ajax({
      url: API + 'diaries/meals',
      method: 'GET',
      data: dateObject
    })
    .then((data) => {
      populateMealsTables(data)
    })
    .fail( (error) => {
      console.error(error)
    })
  }
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

function populateMealsTables(data){
  calories.resetCalories()
  if (Array.isArray(data)) {
    $('#date-box').attr('data-diary-id', `${data[0].diary_id}`)
    data.forEach((meal) => {
      let mealName = meal.name
      addFoodstoMealTable(meal, mealName)
    })
  } else {
    $('#date-box').attr('data-diary-id', `${data.id}`)
  }
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

function searchFoods(){
  let searchName = $('#food-filter').val()
  $('#diary-foods-body').html('')
  return $.ajax({
    url: `${API}search?searchName=${searchName}`,
    method: 'GET',
  })
  .then((data) => {
    makeFoodTable(data)
  })
  .fail( (error) => {
    console.error(error)
  })
}

function removeFoodFromMealTable(button) {
  let mealName = $(button).offsetParent().find('span').text()
  let calorieUpdate = -parseInt($(button).parent().prev().text())
  $(button).parent().parent().remove()

  calories.updateMealTotalCalories(mealName, {calories: calorieUpdate})
  calories.updateMealRemainingCalories(mealName, {calories: calorieUpdate})
  calories.updateRemainingCalories()
  calories.updateConsumedCalories()
}

function removeFoodFromMeal(){
  const button = event.target
  const id = $(button).data("meal-id")

  return $.ajax({
    url: `${API}meals/${id}`,
    method: 'DELETE'
  })
  .then(removeFoodFromMealTable(button))
  .fail((error) => {
    console.error(error)
  })
}
$(document).ready(function(){
  const diary = new Diary

  $('#food-filter').on('input',function(){
    searchFoods()
  })

  diaryFoodTable.getFoods()

  diary.getDiary()

  $('#Breakfast').on('click', (event) => {
    diary.addMeal()
  })
  $('#Lunch').on('click', (event) => {
    diary.addMeal()
  })
  $('#Dinner').on('click', (event) => {
    diary.addMeal()
  })
  $('#Snacks').on('click', (event) => {
    diary.addMeal()
  })
  $('body').on('click','.remove', (event) => {
    removeFoodFromMeal()
  })
  $('body').on('click', '#prev-page-btn', (event) => {
    counter = counter - 1
    diary.getPrevious()
  })

  $('body').on('click', '#next-page-btn', (event) => {
    counter = counter + 1
    diary.getNext()
  })

  $('form').on('submit', (event) => event.preventDefault());
});
