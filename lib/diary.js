const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL ='http://localhost:3000/api/v1/'
$ = require('jquery')

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

}

function addFoodstoMealTable(meal, mealName){
  meal.foods.forEach( (food) => {
    $(`#${mealName}-body`).prepend(`<tr><td >${food.name}</td><td id='${mealName}-calories'>${food.calories}</td><td></td></tr>`)
    updateMealTotalCalories(mealName, food)
    updateMealRemainingCalories(mealName, food)
  })
}

function populateMealsTables(data){
  $('#date-box').attr('data-diary-id', `${data[0].diary_id}`)
  data.forEach((meal) => {
    let mealName = meal.name
    addFoodstoMealTable(meal, mealName)
  })
}

function updateMealTotalCalories(mealName, food){
  let currentValue = parseInt($(`#${mealName}-total-calories`).text())
  let updatedValue = currentValue + food.calories
  $(`#${mealName}-total-calories`).text(updatedValue)
}

function grabFood(data) {
  const mealName = data.name
  $.ajax({
    url: API + `foods/${data.food_id}`,
    method: 'GET',
  }).then ((data) => {
    addFoodToMeal(data, mealName)
  })
  .fail( (error) => {
    console.error(error)
  });
}

function addFoodToMeal(data, mealName){
  $(`#${data.id}`).prop('checked',false);
  const label = $(`#${data.id}`).next()
  $(label).prop('checked', false)
  $(`#${mealName}-body`).prepend(`<tr><td >${data.name}</td><td id='${mealName}-calories'>${data.calories}</td><td></td></tr>`)
  updateMealTotalCalories(mealName, data)
  updateMealRemainingCalories(mealName, data)
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

$('#food-filter').on('input',function(){
  searchFoods()
})

$(document).ready(function(){
  const diary = new Diary

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
  $('form').on('submit', (event) => event.preventDefault());
});
