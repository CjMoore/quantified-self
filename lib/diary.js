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
$(document).ready(function(){
  const diary = new Diary

  diary.getDiary()
  $('form').on('submit', (event) => event.preventDefault());
});
