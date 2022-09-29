var $form = document.querySelector('form');
var $starIcon = document.querySelector('.fa-regular');
var $navBarCardView = document.querySelector('.nav-container.gradient.cv');
var $navBarFavView = document.querySelector('.nav-container.gradient.fv');
var $homeScreenFav = document.querySelector('.favorite-button');
var $favCardParentEle = document.querySelector('.row.bg-grey');
var $modalContainer = document.querySelector('.modal-container');
var $deleteButton = document.querySelector('.delete-button');

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

$navBarCardView.addEventListener('click', navSearchAnchor);
function navSearchAnchor(event) {
  if (event.target.matches('.search-anchor.cv')) {
    swapToSearchView();
    unfillStar();
  } else if (event.target.matches('.favorite-anchor.cv')) {
    swapToFavoriteView();
  }
}

$navBarFavView.addEventListener('click', favSearchAnchor);
function favSearchAnchor(event) {
  if (event.target.matches('.search-anchor.fv')) {
    swapToSearchView();
    unfillStar();
  } else if (event.target.matches('.favorite-anchor.fv')) {
    swapToFavoriteView();
  }
}

$starIcon.addEventListener('click', favCard);
function favCard(event) {
  var $parentAppend = document.querySelector('.row.bg-grey');
  fillStar();
  saveCard();
  var recentFav = renderElement(data.savedCards[0]);
  $parentAppend.prepend(recentFav);
}

$homeScreenFav.addEventListener('click', homeScreenFavSwap);
function homeScreenFavSwap(event) {
  swapToFavoriteView();
}

$favCardParentEle.addEventListener('click', modalPop);
function modalPop(event) {
  showModal();
  var $targetDiv = event.target.closest('[data-card-id]');
  var cardID = parseInt($targetDiv.getAttribute('data-card-id'));
  for (var i = 0; i < data.savedCards.length; i++) {
    if (cardID === data.savedCards[i].savedCardID) {
      data.inspectedCard = data.savedCards[i];
    }
  }
  var chosenCard = data.inspectedCard;
  repopulateModal(chosenCard);
}

$modalContainer.addEventListener('click', closeModal);
function closeModal(event) {
  if (event.target.matches('.modal-content') || event.target.matches('.img-container') || event.target.matches('.column-half')) {
    hideModal();
  }
}

$deleteButton.addEventListener('click', deleteFavCard);
function deleteFavCard(event) {
  var $favCard = document.querySelector(`div[data-card-id="${data.inspectedCard.savedCardID}"]`);
  data.savedCards = data.savedCards.filter(card => card.savedCardID !== data.inspectedCard.savedCardID);
  if ($favCard != null) {
    $favCard.remove();
  }
  swapToFavoriteView();
  data.inspectedCard = null;
  hideModal();
}

window.addEventListener('DOMContentLoaded', handleContentLoaded);
function handleContentLoaded(event) {
  var $parentAppend = document.querySelector('.row.bg-grey');
  for (var i = 0; i < data.savedCards.length; i++) {
    var favoritedCardLoop = renderElement(data.savedCards[i]);
    $parentAppend.appendChild(favoritedCardLoop);
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
  columnDiv.setAttribute('class', 'favorite-column-half display-flex ai-center');
  columnDiv.setAttribute('data-card-id', data.savedCardID);

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

function showModal() {
  var $modalBG = document.querySelector('.modal-container');
  var $modalContent = document.querySelector('.modal-content');
  $modalBG.className = 'modal-container';
  $modalContent.className = 'modal-content';
}

function hideModal() {
  var $modalBG = document.querySelector('.modal-container');
  var $modalContent = document.querySelector('.modal-content');
  $modalBG.className = 'modal-container hidden';
  $modalContent.className = 'modal-content hidden';
}

function repopulateModal(object) {
  var $cardImage = document.querySelector('.modal.card-image');
  var $cardName = document.querySelector('.modal.card-title');
  var $manaCost = document.querySelector('.modal.mana-cost');
  var $cardType = document.querySelector('.modal.card-type');
  var $cardText = document.querySelector('.modal.card-text');
  var $cardMechanics = document.querySelector('.modal.card-text-mechanics');
  var $flavorText = document.querySelector('.modal.flavor-text');
  var $artistName = document.querySelector('.modal.artist');

  $cardImage.src = object.imageUrl;
  $cardName.textContent = object.cardTitle;
  $manaCost.textContent = object.manaCost;
  $cardType.textContent = object.cardType;
  $cardText.textContent = object.cardText;
  $cardMechanics.textContent = object.cardMechanics;
  $flavorText.textContent = object.flavorText;
  $artistName.textContent = object.artistName;
}
