$(document).ready(function() {
  $('.add-animal').on('click', addAnimal);
  getAnimals();
});

function addAnimal() {
  var animal = $('.animal-name').val();
  console.log(animal);
  sendDataToServer(animal);
  $('.animal-name').val('');
}

function sendDataToServer(animalName) {
  console.log(animalName);
  $.ajax({
    type: 'POST',
    url: '/animals',
    data: {"name":animalName},
    success: handleServerResponse
  });
}

function handleServerResponse(response) {
  console.log('Server says: ', response);
  getAnimals();
}

function getAnimals() {
  $.ajax({
    type: 'GET',
    url: '/animals',
    success: updateSelect
  })
}

function updateSelect(serverResponse) {
  console.log(serverResponse);
  $('.animals').empty();
  serverResponse.forEach(function(animal){
    $('.animals').append('<p>We have ' + animal.animal_type +'s(es) in quantity of '+animal.quantity +'</p>');
  });
}
