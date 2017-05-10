const Food = require('./food');


$(document).ready(function(){
  Food.getAll()

  $('.foods').on('click', '.remove', (event) => {
    Food.remove()
  })

  $('form').on('submit', (event) => event.preventDefault());
});
