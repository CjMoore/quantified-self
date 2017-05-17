const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL = 'http://localhost:3000/api/v1/'
const diaryFoodTable = require('./diary-food-table')
const calories = require('./calories')
const foodAdder = require('./diary-food-add')
require('./diary-food-remove')
require('./diary-food-search')
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

function populateMealsTables(data){
  calories.resetCalories()
  if (Array.isArray(data)) {
    $('#date-box').attr('data-diary-id', `${data[0].diary_id}`)
    data.forEach((meal) => {
      let mealName = meal.name
      foodAdder.addFoodstoMealTable(meal, mealName)
    })
  } else {
    $('#date-box').attr('data-diary-id', `${data.id}`)
  }
}

$(document).ready(function(){
  const diary = new Diary

  diaryFoodTable.getFoods()

  diary.getDiary()

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
