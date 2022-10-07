/* exported data */
var data = {
  savedCards: [],
  inspectedCard: null,
  savedCardID: 1
};

var savedCardsJSON = localStorage.getItem('saved-cards');
if (savedCardsJSON != null) {
  data = JSON.parse(savedCardsJSON);
}

addEventListener('beforeunload', handleBeforeUnload);
addEventListener('pagehide', handleBeforeUnload);
function handleBeforeUnload(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('saved-cards', dataJSON);
}
