let data1 = {
    photo: './Pictures/1.jpg',
    title: 'Pelican',
    description: 'Pelican by the lake'
};
let data2 = {
    photo: './Pictures/2.jpg',
    title: 'Bubble',
    description: 'Dude creates cool bubbles, in a castle in Luxembourg'
};
let data3 = {
    photo: './Pictures/3.jpg',
    title: 'Seagull on the beach',
    description: 'Seagull running on the beach, near the Scheveningen pier'
};
let data4 = {
    photo: './Pictures/4.jpg',
    title: 'Castle',
    description: 'Castle in Luxembourg'
};
let data5 = {
    photo: './Pictures/5.jpg',
    title: 'Eagle',
    description: 'Eagle profile at the Cambridge bird sanctuary'
};
let data6 = {
    photo: './Pictures/6.jpg',
    title: 'Turtle out of water',
    description: 'Turtle climbing out of lake onto a platform'
};
let data7 = {
    photo: './Pictures/7.jpg',
    title: 'Eagle',
    description: 'Eagle flying at the Cambridge bird sanctuary'
};  
let data8 = {
    photo: './Pictures/8.jpg',
    title: 'Heron',
    description: 'Heron puffing up their feathers'
};  
let data9 = {
    photo: './Pictures/9.jpg',
    title: 'Listen up!',
    description: 'Water chick mother teaches her offspring to forage'
};  

let data10 = {
    photo: './Pictures/10.jpg',
    title: 'Drinking in orange',
    description: 'Orange Ibis drinking by the side of the pool'
};  

let data11 = {
    photo: './Pictures/11.jpg',
    title: 'Grey vulture',
    description: 'Black and white profile of a grey vulture'
};  

let data12 = {
    photo: './Pictures/12.jpg',
    title: 'Mating dance',
    description: 'Golden pheasant performing his dating dance'
};  

let data13 = {
    photo: './Pictures/13.jpg',
    title: 'Chilling by the lake',
    description: 'Duck is drying up after a swim in the lake.'
};  

let data14 = {
    photo: './Pictures/14.jpg',
    title: 'Hide and seek',
    description: 'Puma hiding in the bushes'
};  
let data15 = {
    photo: './Pictures/15.jpg',
    title: 'Tyto alba',
    description: 'Tyto alba profile'
};  
let data16 = {
    photo: './Pictures/16.jpg',
    title: 'Hellebores',
    description: 'Hellebore plants'
};  
let data17 = {
    photo: './Pictures/17.jpg',
    title: 'Le coq',
    description: 'Rooster profile'
};  


let imagesData = [data1,data2,data3,data4,data5,data6,data7,data8,data9,data10,data11,data12,data13,data14,data15,data16,data17]
let currentPhoto = 0
let previousPhoto = 0

$('#photo').attr('src', imagesData[currentPhoto].photo);
$('#photo-title').text(imagesData[currentPhoto].title);
$('#photo-description').text(imagesData[currentPhoto].description)

let loadPhoto = (photoNumber) => {
    $('#photo').attr('src',imagesData[photoNumber].photo)
}

let highlight = (photoNumber) => {
    $('#thumbnail_'+photoNumber).toggleClass('highlighted')
}
let turnOff = (photoNumber) => {
    $('#thumbnail_'+photoNumber).toggleClass('highlighted')
}
let loadTitle = (photoNumber) => {
    $('#photo-title').text(imagesData[photoNumber].title)
}
let loadDescription = (photoNumber) => {
    $('#photo-description').text(imagesData[photoNumber].description)
}


$('#button_right').click(()=>{
    previousPhoto = currentPhoto
    if (currentPhoto<imagesData.length -1 ) {
        currentPhoto++;
    } else {
        currentPhoto=0
    }
    loadPhoto(currentPhoto)
    loadTitle(currentPhoto)
    loadDescription(currentPhoto)
    highlight(currentPhoto)
    turnOff(previousPhoto)
    
})

$(document).keyup(function(event) {
    if (event.key == 'ArrowRight') {
        previousPhoto = currentPhoto
        if (currentPhoto<imagesData.length -1 ) {
            currentPhoto++;
        } else {
            currentPhoto=0
        }
        loadPhoto(currentPhoto)
        loadTitle(currentPhoto)
        loadDescription(currentPhoto)
        highlight(currentPhoto)
        turnOff(previousPhoto)
    }})   

$(document).keyup(function(event) {
     if (event.key == 'ArrowLeft') {
        previousPhoto = currentPhoto
        if (currentPhoto>0) {
            currentPhoto--;
        } else {
            currentPhoto=imagesData.length-1;
        }
        loadPhoto(currentPhoto)
        loadTitle(currentPhoto)
        loadDescription(currentPhoto)
        highlight(currentPhoto)
        turnOff(previousPhoto)
        }})   

$('#button_left').click(()=>{
    previousPhoto = currentPhoto
    if (currentPhoto>0) {
        currentPhoto--;
    } else {
        currentPhoto=imagesData.length-1;
    }
    loadPhoto(currentPhoto)
    loadTitle(currentPhoto)
    loadDescription(currentPhoto)
    highlight(currentPhoto)
    turnOff(previousPhoto)
})

let thumbnails = []


imagesData.forEach(element => {
    thumbnails.push('<div id="thumbnail_'+imagesData.indexOf(element)+'"class=thumbnail data-photo="'+imagesData.indexOf(element)+'"> <img src="'+element.photo+'"alt=""> <span class="hovertitle">'+element.title+'</span></div>')
});

$('#small_container').html(thumbnails)


$('#small_container').on('click', '.thumbnail', (event) => {
    previousPhoto = currentPhoto
    currentPhoto= $(event.currentTarget).attr('data-photo')
    loadPhoto(currentPhoto)
    loadTitle(currentPhoto)
    loadDescription(currentPhoto)
    highlight(currentPhoto)
    turnOff(previousPhoto)

  });





loadPhoto(currentPhoto);
loadTitle(currentPhoto);
loadDescription(currentPhoto);
highlight(currentPhoto);