var $form = document.querySelector('form');
var $searchAnchor = document.querySelector('.search-anchor');

$form.addEventListener('submit', handleSubmit);
function handleSubmit(event) {
  event.preventDefault();
  var $searchBar = document.querySelector('.user-search');
  var userSearch = $searchBar.value;
  var $cardImage = document.querySelector('.card-image');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.magicthegathering.io/v1/cards?name=' + userSearch);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var card = xhr.response.cards[0];
    swapToCardView();
    $cardImage.src = card.imageUrl;
    showCardInfo(card);
  });
  xhr.send();
}

$searchAnchor.addEventListener('click', handleClick);
function handleClick(event) {
  if (event.target.matches('.search-anchor')) {
    swapToSearchView();
  }
}

function swapToSearchView() {
  var $searchView = document.querySelector('.home-screen');
  var $cardView = document.querySelector('.card-view');
  $searchView.className = 'home-screen';
  $cardView.className = 'card-view hidden';
}

function swapToCardView() {
  var $searchView = document.querySelector('.home-screen');
  var $cardView = document.querySelector('.card-view');
  $cardView.className = 'card-view';
  $searchView.className = 'home-screen hidden';
}

function showCardInfo(object) {
  var $cardName = document.querySelector('.card-title');
  var $manaCost = document.querySelector('.mana-cost');
  var $cardType = document.querySelector('.card-type');
  var $cardText = document.querySelector('.card-text');
  var $cardMechanics = document.querySelector('.card-text-mechanics');
  var $flavorText = document.querySelector('.flavor-text');
  var $artistName = document.querySelector('.artist');
  var splitCardText = object.text.split('\n');

  $cardName.textContent = object.name;
  $manaCost.textContent = object.manaCost;
  $cardType.textContent = object.originalType;
  $cardText.textContent = splitCardText[0];
  $cardMechanics.textContent = splitCardText[1];
  $flavorText.textContent = object.flavor;
  if (object.flavor == null) {
    $flavorText.textContent = '';
  }
  $artistName.textContent = 'Illustrated by: ' + object.artist;
}
