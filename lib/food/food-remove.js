const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL ='http://localhost:3000/api/v1/'
const $ = require('jquery')


function remove () {
  const button = event.target
  const id = $(button).data("food-id")

  return $.ajax({
    url: API + `foods/${id}`,
    method: 'DELETE',
  })
  .then(removeFromFoodTable(button))
  .fail( (error) => {
    console.error(error)
  })
}

function removeFromFoodTable(button) {
  $(button).parent().parent().empty().remove()
}

module.exports = {remove: remove}
