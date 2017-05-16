const mealNames = ["Breakfast", "Lunch", "Dinner", "Snacks"]

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

function updateMealTotalCalories(mealName, food){
  let currentValue = parseInt($(`#${mealName}-total-calories`).text())
  let updatedValue = currentValue + food.calories
  $(`#${mealName}-total-calories`).text(updatedValue)
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

module.exports = {updateMealRemainingCalories: updateMealRemainingCalories,
                  updateMealTotalCalories: updateMealTotalCalories,
                  resetCalories: resetCalories,
                  updateConsumedCalories: updateConsumedCalories,
                  updateRemainingCalories: updateRemainingCalories}
