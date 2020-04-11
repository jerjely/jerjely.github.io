let clicks = 0



$('#add').click(() => {
  $('#list').append(
    `<div class='todo'> 
           <p>`+document.getElementById('input').value+`</p>  
           <button class=trashButton><img src="./trash-solid.svg" alt=""></button>
           <div class=empty><button class=tickOffButton><img src="./unticked.png" alt="ticked"></button></div>
    </div>`
  ); $('#input').val('')})


$(document).keyup(function(event) {
    if ($("#input").is(":focus") && event.key == "Enter") {
        $('#list').append(
            `<div class='todo'> 
                <p>`+document.getElementById('input').value+`</p>  
                <button class=trashButton><img src="./trash-solid.svg" alt=""></button>
                <div class=empty><button class=tickOffButton><img src="./unticked.png" alt="ticked"></button></div>
            </div>` 
          ),$('#input').val('')
        }
    
});

$('#list').on('click', '.trashButton', (event) => {
    $(event.currentTarget.parentNode).remove();
  });

  $('#list').on('click', '.tickOffButton', (event) => {
    $(event.currentTarget.parentNode).html('<button class=tickOnButton><img src="./ticked.png" alt="ticked"></button>');
  });


  $('#list').on('click', '.tickOnButton', (event) => {
    $(event.currentTarget.parentNode).html('<button class=tickOffButton><img src="./unticked.png" alt="ticked"></button>');
  });

  