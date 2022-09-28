var $form = document.querySelector('form');
var $starIcon = document.querySelector('.fa-regular');

$form.addEventListener('submit', handleSubmit);
function handleSubmit(event) {
  event.preventDefault();
  var $searchBar = document.querySelector('.user-search');
  var userSearch = $searchBar.value;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.magicthegathering.io/v1/cards?name=' + userSearch);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var card = xhr.response.cards[0];
    swapToCardView();
    showCardInfo(card);
  });
  xhr.send();
}

document.addEventListener('click', handleClick);
function handleClick(event) {
  if (event.target.matches('.search-anchor')) {
    swapToSearchView();
    unfillStar();
  } else if (event.target.matches('.fa-regular')) {
    var $parentAppend = document.querySelector('.row.mt-5p');
    fillStar();
    saveCard();
    var recentFav = renderElement(data.savedCards[0]);
    $parentAppend.appendChild(recentFav);
  } else if (event.target.matches('.favorite-anchor') || event.target.matches('.favorite-button')) {
    swapToFavoriteView();
  }
}

function swapToSearchView() {
  var $searchView = document.querySelector('.home-screen');
  var $cardView = document.querySelector('.card-view');
  var $favoriteView = document.querySelector('.favorite-cards-view');
  $form.reset();
  $searchView.className = 'home-screen';
  $cardView.className = 'card-view hidden';
  $favoriteView.className = 'favorite-cards-view hidden';
}

function swapToCardView() {
  var $searchView = document.querySelector('.home-screen');
  var $cardView = document.querySelector('.card-view');
  var $favoriteView = document.querySelector('.favorite-cards-view');
  $searchView.className = 'home-screen hidden';
  $cardView.className = 'card-view';
  $favoriteView.className = 'favorite-cards-view hidden';
}

function swapToFavoriteView() {
  var $searchView = document.querySelector('.home-screen');
  var $cardView = document.querySelector('.card-view');
  var $favoriteView = document.querySelector('.favorite-cards-view');
  $searchView.className = 'home-screen hidden';
  $cardView.className = 'card-view hidden';
  $favoriteView.className = 'favorite-cards-view';
}

function showCardInfo(object) {
  var $cardImage = document.querySelector('.card-image');
  var $cardName = document.querySelector('.card-title');
  var $manaCost = document.querySelector('.mana-cost');
  var $cardType = document.querySelector('.card-type');
  var $cardText = document.querySelector('.card-text');
  var $cardMechanics = document.querySelector('.card-text-mechanics');
  var $flavorText = document.querySelector('.flavor-text');
  var $artistName = document.querySelector('.artist');
  var splitCardText = object.text.split('\n');

  $cardImage.src = object.imageUrl;
  $cardName.textContent = object.name;
  $manaCost.textContent = 'Cost: ' + object.manaCost;
  $cardType.textContent = object.originalType;
  $cardText.textContent = splitCardText[0];
  $cardMechanics.textContent = splitCardText[1];
  $flavorText.textContent = object.flavor;
  if (object.flavor == null) {
    $flavorText.textContent = '';
  }
  $artistName.textContent = 'Illustrated by: ' + object.artist;
}

function fillStar() {
  $starIcon.className = 'fa-solid fa-star';
}

function unfillStar() {
  $starIcon.className = 'fa-regular fa-star';
}

function saveCard() {
  var newObj = {};
  var $cardImage = document.querySelector('.card-image');
  var $cardName = document.querySelector('.card-title');
  var $manaCost = document.querySelector('.mana-cost');
  var $cardType = document.querySelector('.card-type');
  var $cardText = document.querySelector('.card-text');
  var $cardMechanics = document.querySelector('.card-text-mechanics');
  var $flavorText = document.querySelector('.flavor-text');
  var $artistName = document.querySelector('.artist');

  newObj.imageUrl = $cardImage.getAttribute('src');
  newObj.savedCardID = data.savedCardID;
  newObj.cardTitle = $cardName.textContent;
  newObj.manaCost = $manaCost.textContent;
  newObj.cardType = $cardType.textContent;
  newObj.cardText = $cardText.textContent;
  newObj.cardMechanics = $cardMechanics.textContent;
  newObj.flavorText = $flavorText.textContent;
  newObj.artistName = $artistName.textContent;
  data.savedCardID++;
  data.savedCards.unshift(newObj);
}

function renderElement(data) {
  var columnDiv = document.createElement('div');
  columnDiv.setAttribute('class', 'favorite-column-half display-flex ai-center jc-center');

  var imgContainerDiv = document.createElement('div');
  imgContainerDiv.setAttribute('class', 'favorite-image-container');
  columnDiv.appendChild(imgContainerDiv);

  var favoriteImg = document.createElement('img');
  favoriteImg.setAttribute('class', 'favorite-image');
  favoriteImg.setAttribute('alt', 'placeholder');
  favoriteImg.setAttribute('src', data.imageUrl);
  imgContainerDiv.appendChild(favoriteImg);

  return columnDiv;
}

window.addEventListener('DOMContentLoaded', handleContentLoaded);
function handleContentLoaded(event) {
  var $parentAppend = document.querySelector('.row.bg-grey');
  for (var i = 0; i < data.savedCards.length; i++) {
    var favoritedCardLoop = renderElement(data.savedCards[i]);
    $parentAppend.appendChild(favoritedCardLoop);
  }
}
