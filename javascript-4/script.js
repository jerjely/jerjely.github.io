

$('#firstButton').click(() => { 
    console.log('Yeah, you clicked me!')
})

$('#firstButton').click(() => {
    $('#firstButton').text('click on here,please')
})

$('#secondButton').click(() => {
        $('#firstButton').text('You clicked the second button, fool!')
})

$('#thirdButton').click(() => {
    $('button').css('background','yellow')
})

let clicked = false 

$('#colorButton').click(() => {
    if (!clicked) {
        $('button').css('background',document.getElementById('colorinput').value)
        // Set clicked to true
        clicked = true;}
})



