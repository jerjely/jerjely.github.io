let names = ['Tomi','Julia','Mama','Papa','Gergo']

names.forEach((name) => {
    $('.names').append('<li id='+name+'>'+name+'</li>')
});

$('#Gergo').css({
    'font-weight':'bold',
    'color':'red'})


let additionalBlock = {
    title: "Added with javascript",
    text: "This block was added using JavaScript's jQuery library. How awesome!"
    };

$('#additonalblock').append('<h1>'+additionalBlock.title+'</h1><p>'+additionalBlock.text+'</p>')

if