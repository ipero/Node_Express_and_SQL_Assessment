$(document).ready(function() {
  $('.add-animal').on('click', addAnimal);
  getAnimals();
});

//Send new animal type to Server
function addAnimal() {
  var animal = $('.animal-name').val();
  $('.animal-name').val('');
  $.ajax({
    type: 'POST',
    url: '/animals',
    data: {"name":animal},
    success: getAnimals
  });
}

// Get all animals in DB
function getAnimals() {
  $.ajax({
    type: 'GET',
    url: '/animals',
    success: updateDom
  })
}
// Display all animals from DB to the DOM
function updateDom(animals) {
  $('.animals').empty();
  animals.forEach(function(animal){
    $('.animals').append('<p>We have ' + animal.animal_type +
    '(s/es) in quantity of '+animal.quantity +'</p>');
  });
}
