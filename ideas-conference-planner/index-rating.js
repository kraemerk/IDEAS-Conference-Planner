const ipc = require('electron').ipcRenderer;

var titleDiv = document.getElementById('titleDiv');
var descDiv = document.getElementById('descDiv');
var objDiv = document.getElementById('objDiv');
var subButton = document.getElementById('submitreview');
var backButton = document.getElementById('backHome');

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
  ipc.send('update-rating', getRatingVals());
  window.location = "index.html";
}, false)

backButton.addEventListener('click', () => {
  window.location = "index.html";
}, false)

function getRatingVals() {
  return {
    titleVal: document.querySelector('input[name="group1"]:checked').value,
    gramVal: document.querySelector('input[name="group2"]:checked').value,
    credVal: document.querySelector('input[name="group3"]:checked').value,
    intrVal: document.querySelector('input[name="group4"]:checked').value,
    contVal: document.querySelector('input[name="group5"]:checked').value,
    novVal: document.querySelector('input[name="group6"]:checked').value,
    overVal: document.querySelector('input[name="group7"]:checked').value,
    rateFName: document.getElementById('fname').value,
    rateLName: document.getElementById('lname').value,
    presID: sessionStorage.presID
  };
}