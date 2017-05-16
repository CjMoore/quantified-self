const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL ='http://localhost:3000/api/v1/'
const $ = require('jquery')
const FoodRemove = require('./food-remove')
const FoodAdd = require('./food-add')
const FoodTable = require('./food-table')

const Food = class Food {

  constructor () {
    FoodTable.getAll()

    $('.foods').on('click', '.remove', (event) => {
      FoodRemove.remove()
    })

    $('.foods').on('click', '.food-cell', (event) => {
      const cellValue = $(event.target).text();
      const td = event.target
      $(td).html($('<input />',{'value' : cellValue}).val(cellValue).attr('id', cellValue))

      const cell = $(td).children()[0]

      cell.focus()

      $('table').on('focusout', cell, (event) => {
        this.editName()
      })

      $(cell).keypress( (event) => {
        if(event.which == 13) {
          this.editName()
        }
      });
    })

    $('.foods').on('click', '.calorie-cell', (event) => {
      const cellValue = $(event.target).text();
      $(event.target).html($('<input />',{'value' : cellValue}).val(cellValue).attr('id', cellValue))

      $(`#${cellValue}`).focus()

      $('table').on('focusout', `#${cellValue}`, (event) => {
        this.editCalories()
      })

      $(`#${cellValue}`).keypress( (event) => {
        if(event.which == 13) {
          this.editCalories()
        }
      });
    })

    $('#new-food').submit( (event) => FoodAdd.addFood())

    $('form').on('submit', (event) => event.preventDefault());
  }

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
      this.updateCellName(data, tr)
    })
    .fail( (error) => {
      console.error(error)
    });
  };

  editCalories() {
    const toEdit = {name: $(event.target).parent().prev().text(), calories: $(event.target).val()}

    const tr = $(event.target).parent().parent()
    const id = tr.data('food-id')

    $.ajax({
      url: API + `foods/${id}`,
      method: 'PATCH',
      data: toEdit
    })
    .then( (data) => {
      this.updateCellCalories(data, tr)
    })
    .fail( (error) => {
      console.error(error)
    });
  };

  searchFoods(){
    let searchName = $('#food-filter').val()
    $('.foods tbody').html('')
    return $.ajax({
      url: `${API}search?searchName=${searchName}`,
      method: 'GET',
    })
    .then( (data) => {
      this.makeFoodTable(data)
    })
    .fail( (error) => {
      console.error(error)
    })
  }

  updateCellName (data, tr) {
    const td = ($(tr).children()[0])
    $(td).children()[0].remove()
    $(td).text(data[0].name)
  }

  updateCellCalories( data, tr) {
    const td = ($(tr).children()[1])
    $(td).children()[0].remove()
    $(td).text(data[0].calories)
  }
};


$(document).ready(function(){
  const food = new Food

  $('#food-filter').on('input',function(){
    food.searchFoods()
  })

  $('form').on('submit', (event) => event.preventDefault());
});
