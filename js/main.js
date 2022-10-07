var $form = document.querySelector('form');
var $starIcon = document.querySelector('.fa-regular');
var $navBarCardView = document.querySelector('.nav-container.gradient.cv');
var $navBarFavView = document.querySelector('.nav-container.gradient.fv');
var $homeScreenFav = document.querySelector('.favorite-button');
var $favCardParentEle = document.querySelector('.row.bg-grey');
var $modalContainer = document.querySelector('.modal-container');
var $deleteButton = document.querySelector('.delete-button');
var $navBarNoResult = document.querySelector('.nav-container.gradient.nr');
var $navBarNetworkError = document.querySelector('.nav-container.gradient.ne');
var $navBarNoSavedCards = document.querySelector('.nav-container.gradient.nfv');

$form.addEventListener('submit', handleSubmit);
function handleSubmit(event) {
  event.preventDefault();
  viewSwap('loading-screen');
  var $searchBar = document.querySelector('.user-search');
  var userSearch = $searchBar.value;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.magicthegathering.io/v1/cards?name=' + userSearch);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var card = xhr.response.cards[0];
    if (xhr.status >= 400) {
      viewSwap('network-error');
    }
    if (card === undefined) {
      viewSwap('no-results');
    } else {
      viewSwap('card-results');
      showCardInfo(card);
    }
  });
  xhr.send();
}

$navBarCardView.addEventListener('click', navSearchAnchor);
function navSearchAnchor(event) {
  navBarFunction();
}

$navBarFavView.addEventListener('click', favSearchAnchor);
function favSearchAnchor(event) {
  navBarFunction();
}

$navBarNoResult.addEventListener('click', noResultSearchAnchor);
function noResultSearchAnchor(event) {
  navBarFunction();
}

$navBarNetworkError.addEventListener('click', networkErrorSearchAnchor);
function networkErrorSearchAnchor(event) {
  navBarFunction();
}

$navBarNoSavedCards.addEventListener('click', noSavedCardSearchAnchor);
function noSavedCardSearchAnchor(event) {
  navBarFunction();
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
  if (data.savedCards.length === 0) {
    viewSwap('no-favorite-cards');
  } else {
    viewSwap('favorite-cards');
  }
}

$favCardParentEle.addEventListener('click', modalAppear);
function modalAppear(event) {
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
  if (event.target.matches('.modal-content') || event.target.matches('.img-container') || event.target.matches('.column-half') || event.target.matches('.row') ||
  (event.target.matches('.card-image')) || event.target.matches('.text-container')) {
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
  if (data.savedCards.length === 0) {
    viewSwap('no-favorite-cards');
  } else {
    viewSwap('favorite-cards');
  }
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

function viewSwap(desiredView) {
  var $views = document.querySelectorAll('.view');
  for (var i = 0; i < $views.length; i++) {
    if ($views[i].getAttribute('data-view') === desiredView) {
      $views[i].className = 'view';
    } else {
      $views[i].className = 'view hidden';
    }
  }
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
  var $extraMechanics = document.querySelector('.xtra-mechanics');
  if (object.text) {
    var splitCardText = object.text.split('\n');
    $cardText.textContent = splitCardText[0];
    $cardMechanics.textContent = splitCardText[1];
    if (splitCardText.length > 2) {
      $extraMechanics.textContent = splitCardText[2];
    }
  }
  if (object.imageUrl === undefined) {
    $cardImage.src = 'images/mtgPlaceholder.jpeg';
  } else {
    $cardImage.src = object.imageUrl;
  }
  $cardName.textContent = object.name;
  for (var i = 0; i < data.savedCards.length; i++) {
    if (data.savedCards[i].cardTitle === object.name) {
      fillStar();
    }
  }
  $manaCost.textContent = 'Cost: ' + object.manaCost;
  if (object.originalType) {
    $cardType.textContent = object.originalType;
  } else if (object.type) {
    $cardType.textContent = object.type;
  }
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
  var $extraMechanics = document.querySelector('.xtra-mechanics');
  var $flavorText = document.querySelector('.flavor-text');
  var $artistName = document.querySelector('.artist');

  newObj.imageUrl = $cardImage.getAttribute('src');
  newObj.savedCardID = data.savedCardID;
  newObj.cardTitle = $cardName.textContent;
  newObj.manaCost = $manaCost.textContent;
  newObj.cardType = $cardType.textContent;
  newObj.cardText = $cardText.textContent;
  newObj.cardMechanics = $cardMechanics.textContent;
  newObj.extraMechanics = $extraMechanics.textContent;
  newObj.flavorText = $flavorText.textContent;
  newObj.artistName = $artistName.textContent;
  data.savedCardID++;
  data.savedCards.unshift(newObj);
}

function renderElement(data) {
  var columnDiv = document.createElement('div');
  columnDiv.setAttribute('class', 'favorite-column display-flex ai-center');
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
  var $extraMechanics = document.querySelector('.xtra-mechanics');
  var $flavorText = document.querySelector('.modal.flavor-text');
  var $artistName = document.querySelector('.modal.artist');

  $cardImage.src = object.imageUrl;
  $cardName.textContent = object.cardTitle;
  $manaCost.textContent = object.manaCost;
  $cardType.textContent = object.cardType;
  $cardText.textContent = object.cardText;
  $cardMechanics.textContent = object.cardMechanics;
  $extraMechanics.textContent = object.extraMechanics;
  $flavorText.textContent = object.flavorText;
  $artistName.textContent = object.artistName;
}

function resetCardView() {
  var $cardPic = document.querySelector('.card-image');
  var $cardInfo = document.querySelector('.text-container');
  $cardPic.className = 'card-image';
  $cardInfo.className = 'text-container';
}

function navBarFunction() {
  if (event.target.matches('.search-anchor')) {
    $form.reset();
    viewSwap('search-page');
    unfillStar();
    resetCardView();
  } else if (event.target.matches('.favorite-anchor')) {
    if (data.savedCards.length === 0) {
      viewSwap('no-favorite-cards');
    } else {
      viewSwap('favorite-cards');
    }
  }
}
