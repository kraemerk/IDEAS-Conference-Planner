const ipc = require('electron').ipcRenderer;

var titleDiv = document.getElementById('titleDiv');
var descDiv = document.getElementById('descDiv');
var objDiv = document.getElementById('objDiv');
var subButton = document.getElementById('submitreview');

var td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presTitle));
titleDiv.appendChild(td);

td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presDesc));
descDiv.appendChild(td);

td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presObj1));
objDiv.appendChild(td);

td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presObj2));
objDiv.appendChild(td);

td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presObj3));
objDiv.appendChild(td);

subButton.addEventListener('click', () => {
  var ratingVals = getRatingVals;
  ipc.send('update-rating', ratingVals);
  window.location = "index.html";
}, false)

function getRatingVals() {
  var ratingVals = {
    titleVal: document.querySelector('input[name="group1"]:checked').value,
    gramVal: document.querySelector('input[name="group2"]:checked').value,
    credVal: document.querySelector('input[name="group3"]:checked').value,
    intrVal: document.querySelector('input[name="group4"]:checked').value,
    contVal: document.querySelector('input[name="group5"]:checked').value,
    novVal: document.querySelector('input[name="group6"]:checked').value,
    overVal: document.querySelector('input[name="group7"]:checked').value,
    raterVal: document.querySelector('input[name="group8"]:checked').value,
    rateFName: document.getElementById(fname).value,
    rateLName: document.getElementById(lname).value
  };
  return ratingVals;
}

function sendRating() {
  var ratings = getRatingVals;
  ipc.send('ingest-rating', ratings);
  window.location = 'index.html';
}
