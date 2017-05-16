const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL = 'http://localhost:3000/api/v1/'
$ = require('jquery')

const mealNames = ["Breakfast", "Lunch", "Dinner", "Snacks"]
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
    .done(populateMealsTables)
    .fail( (error) => {
      console.error(error)
    })
  }


  getFoods() {
    return $.ajax({
    method: 'GET',
    url: API + 'foods',
    })
    .done(makeFoodTable)
    .fail( (error) => {
      console.error(error)
    });
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

    resetCalories()

    $('#date-container').empty()
    $('#date-container').append(date)

    return $.ajax({
      url: API + 'diaries/meals',
      method: 'GET',
      data: dateObject
    })
    .done(populateMealsTables)
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

    resetCalories()

    $('#date-container').empty()
    $('#date-container').append(date)

    return $.ajax({
      url: API + 'diaries/meals',
      method: 'GET',
      data: dateObject
    })
    .done(populateMealsTables)
    .fail( (error) => {
      console.error(error)
    })
  }
}

function resetCalories() {
  $('#Breakfast-total-calories').text(0)
  $('#Breakfast-remaining-calories').css('color', 'green').text(400)

  $('#Dinner-total-calories').text(0)
  $('#Dinner-remaining-calories').css('color', 'green').text(800)

  $('#Lunch-total-calories').text(0)
  $('#Lunch-remaining-calories').css('color', 'green').text(600)

  $('#Snacks-total-calories').text(0)
  $('#Snacks-remaining-calories').css('color', 'green').text(200)

  $('#consumed-calories').text(0)
  $('#remaining-calories').css('color', 'green').text(2000)
}

function makeFoodTable(data) {
  data.forEach( (food) => {
    $('#diary-foods-body').prepend(`<tr data-food-id=${food.id}><td class='food-cell' >${food.name}</td><td class='calorie-cell'>${food.calories}</td><td><input type="checkbox" id="${food.id}" data-food-name="${food.name}"/><label for="${food.id}"></label></td></tr>`)
  })
}

function updateMealRemainingCalories(mealName, food){
  let currentValue = parseInt($(`#${mealName}-remaining-calories`).text())
  let updatedValue = currentValue - food.calories
  $(`#${mealName}-remaining-calories`).text(updatedValue)
  if(updatedValue < 0) {
    $(`#${mealName}-remaining-calories`).css('color', 'red')
  } else if (updatedValue >= 0) {
    $(`#${mealName}-remaining-calories`).css('color', 'green')
  }

}

function addFoodstoMealTable(meal, mealName){

  if (Array.isArray(meal.foods)) {
    meal.foods.forEach( (food) => {
      $(`#${mealName}-body`).prepend(`<tr><td >${food.name}</td><td id='${mealName}-calories'>${food.calories}</td><td><button data-meal-id=${food.meal_id} class='remove btn red darken-3'>-</button></td></tr>`)
      updateMealTotalCalories(mealName, food)
      updateMealRemainingCalories(mealName, food)
    })
    updateConsumedCalories()
  }
}

function updateConsumedCalories(){
  $('#consumed-calories').text(0)
    mealNames.forEach( (mealName) => {
      let mealCalories = parseInt($(`#${mealName}-total-calories`).text())
      let totalCalories = parseInt($('#consumed-calories').text())
      $('#consumed-calories').text(`${mealCalories + totalCalories}`)
    })
    updateRemainingCalories()
}

function updateRemainingCalories(){
  let consumedCalories = parseInt($('#consumed-calories').text())
  $('#remaining-calories').text(`${2000 - consumedCalories}`)
  if ((2000 - consumedCalories) < 0) {
    $('#remaining-calories').css('color', 'red')
  }
  else if (2000 - consumedCalories >= 0) {
    $('#remaining-calories').css('color', 'green')

  }

}
function populateMealsTables(data){
  resetCalories()
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

function updateMealTotalCalories(mealName, food){
  let currentValue = parseInt($(`#${mealName}-total-calories`).text())
  let updatedValue = currentValue + food.calories
  $(`#${mealName}-total-calories`).text(updatedValue)
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
  updateMealTotalCalories(mealName, data)
  updateMealRemainingCalories(mealName, data)
  updateRemainingCalories()
  updateConsumedCalories()
}

function searchFoods(){
  let searchName = $('#food-filter').val()
  $('#diary-foods-body').html('')
  return $.ajax({
    url: `${API}search?searchName=${searchName}`,
    method: 'GET',
  })
  .done(makeFoodTable)
  .fail( (error) => {
    console.error(error)
  })
}



  function removeFoodFromMealTable(button) {
    let mealName = $(button).offsetParent().find('span').text()
    let calories = -parseInt($(button).parent().prev().text())
    $(button).parent().parent().remove()
    console.log(mealName)
    updateMealTotalCalories(mealName, {calories: calories})
    updateMealRemainingCalories(mealName, {calories: calories})
    updateRemainingCalories()
    updateConsumedCalories()
  }

function removeFoodFromMeal(){
  const button = event.target
  const id = $(button).data("meal-id")

  return $.ajax({
    url: `${API}meals/${id}`,
    method: 'DELETE'
  })
  .done(removeFoodFromMealTable(button))
  .fail((error) => {
    console.error(error)
  })
}
$(document).ready(function(){
  const diary = new Diary

  $('#food-filter').on('input',function(){
    searchFoods()
  })

  diary.getFoods()

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
