const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL = 'http://localhost:3000/api/v1/'
const calories = require('./calories')

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

module.exports = {removeFoodFromMeal: removeFoodFromMeal}
