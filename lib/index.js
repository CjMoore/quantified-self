const Food = require('./food');

$(document).ready(function(){
  Food.getAll()

  $('.foods').on('click', '.remove', (event) => {
    Food.remove()
  })

  $('#new-food').submit( (event) => Food.addFood())

  $('form').on('submit', (event) => event.preventDefault());
});
