const API = 'https://qs-be.herokuapp.com/api/v1/'
const LOCAL ='http://localhost:3000/api/v1/'
$ = require('jquery')

const Diary = class Diary {

  getDiary() {
    
  }
}

$(document).ready(function(){
  const diary = new Diary

  diary.getDiary()
  $('form').on('submit', (event) => event.preventDefault());
});
