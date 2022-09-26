var $form = document.querySelector('form');

$form.addEventListener('submit', handleSubmit);
function handleSubmit(event) {
  event.preventDefault();
  var $searchBar = document.querySelector('.user-search');
  var userSearch = $searchBar.value;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.magicthegathering.io/v1/cards?name=' + userSearch);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {

  });
  xhr.send();
}
