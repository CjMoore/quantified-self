const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL ='http://localhost:3000/api/v1/'
const $ = require('jquery')

function editName() {
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

function updateCellName (data, tr) {
  const td = ($(tr).children()[0])
  $(td).children()[0].remove()
  $(td).text(data[0].name)
}

function editCalories() {
  const toEdit = {name: $(event.target).parent().prev().text(), calories: $(event.target).val()}

  const tr = $(event.target).parent().parent()
  const id = tr.data('food-id')

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

function updateCellCalories( data, tr) {
  const td = ($(tr).children()[1])
  $(td).children()[0].remove()
  $(td).text(data[0].calories)
}

$(document).ready(function(){
  $('.foods').on('click', '.food-cell', (event) => {
    const cellValue = $(event.target).text();
    const td = event.target
    $(td).html($('<input />',{'value' : cellValue}).val(cellValue).attr('id', cellValue))

    const cell = $(td).children()[0]

    cell.focus()

    $('table').on('focusout', cell, (event) => {
      editName()
    })

    $(cell).keypress( (event) => {
      if(event.which == 13) {
        editName()
      }
    });
  })

  $('.foods').on('click', '.calorie-cell', (event) => {
    const cellValue = $(event.target).text();
    $(event.target).html($('<input />',{'value' : cellValue}).val(cellValue).attr('id', cellValue))

    $(`#${cellValue}`).focus()

    $('table').on('focusout', `#${cellValue}`, (event) => {
      editCalories()
    })

    $(`#${cellValue}`).keypress( (event) => {
      if(event.which == 13) {
        editCalories()
      }
    });
  })
});
