var $form = document.querySelector('form');

$form.addEventListener('submit', handleSubmit);
function handleSubmit(event) {
  event.preventDefault();
  var $searchBar = document.querySelector('.user-search');
  var userSearch = $searchBar.value;
  getCardData(userSearch);
}

function getCardData(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.magicthegathering.io/v1/cards?name=' + name);
  xhr.responseType = 'json';
  xhr.send();
}
