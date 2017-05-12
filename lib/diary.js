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
    const date = `<div class='row'><div class='col s6'><button class='btn'><</button><h1>${todaysDate}</h1><button class='btn'>></button></div></div>`

    $('.container').append(date)

    return $.ajax({
      url: API + 'diaries/meals',
      method: 'GET',
      data: dateObject
    })
    .done(checkReturn)
    .fail( (error) => {
      console.error(error)
    })
  }
}

function checkReturn(data){
  console.log(data)
}
$(document).ready(function(){
  const diary = new Diary

  diary.getDiary()
  $('form').on('submit', (event) => event.preventDefault());
});
