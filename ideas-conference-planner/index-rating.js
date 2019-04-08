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
  var allFilled = checkRadioStatus();
  if(allFilled) {
    ipc.send('update-rating', getRatingVals());
    window.location = "index.html";
  } else {
    alert("All rating fields must be filled.");
  }
}, false)

backButton.addEventListener('click', () => {
  window.location = "index.html";
}, false)

document.addEventListener('DOMContentLoaded', queryRadioButtons);

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

function generateRadioValues(radiosList) {
  console.log(radiosList);
  var radios1 = document.getElementsByName('group1');
  var radios2 = document.getElementsByName('group2');
  var radios3 = document.getElementsByName('group3');
  var radios4 = document.getElementsByName('group4');
  var radios5 = document.getElementsByName('group5');
  var radios6 = document.getElementsByName('group6');
  var radios7 = document.getElementsByName('group7');

  radios1[radiosList.title_rating - 1].checked = true;
  radios2[radiosList.grammar_rating - 1].checked = true;
  radios3[radiosList.credibility_rating - 1].checked = true;
  radios4[radiosList.interest_rating - 1].checked = true;
  radios5[radiosList.content_rating - 1].checked = true;
  radios6[radiosList.novelty_rating - 1].checked = true;
  radios7[radiosList.overall_rating - 1].checked = true;
}

function checkRadioStatus() {
  var radios1 = document.getElementsByName('group1');
  var radios2 = document.getElementsByName('group2');
  var radios3 = document.getElementsByName('group3');
  var radios4 = document.getElementsByName('group4');
  var radios5 = document.getElementsByName('group5');
  var radios6 = document.getElementsByName('group6');
  var radios7 = document.getElementsByName('group7');
  var r1f = false;
  var r2f = false;
  var r3f = false;
  var r4f = false;
  var r5f = false;
  var r6f = false;
  var r7f = false;

  for(var i = 0; i < radios1.length; ++i) {
    if(radios1[i].checked) {
      r1f = true;
      break;
    }
  }
  if(!r1f) {
    return false;
  }

  for(var i = 0; i < radios2.length; ++i) {
    if(radios2[i].checked) {
      r2f = true;
      break;
    }
  }
  if(!r2f) {
    return false;
  }

  for(var i = 0; i < radios3.length; ++i) {
    if(radios3[i].checked) {
      r3f = true;
      break;
    }
  }
  if(!r3f) {
    return false;
  }

  for(var i = 0; i < radios4.length; ++i) {
    if(radios4[i].checked) {
      r4f = true;
      break;
    }
  }
  if(!r4f) {
    return false;
  }

  for(var i = 0; i < radios5.length; ++i) {
    if(radios5[i].checked) {
      r5f = true;
      break;
    }
  }
  if(!r5f) {
    return false;
  }

  for(var i = 0; i < radios6.length; ++i) {
    if(radios6[i].checked) {
      r6f = true;
      break;
    }
  }
  if(!r6f) {
    return false;
  }

  for(var i = 0; i < radios7.length; ++i) {
    if(radios7[i].checked) {
      r7f = true;
      break;
    }
  }
  if(!r7f) {
    return false;
  }

  if(document.getElementById('fname').value.length == 0) {
    return false;
  }

  if(document.getElementById('lname').value.length == 0) {
    return false;
  }

  return true;
}

function queryRadioButtons() {
  ipc.send('query-radios', sessionStorage.presID);
}

ipc.on('query-radios-reply', function(event, arg) {
  var radiosList = JSON.parse(arg);
  generateRadioValues(radiosList);
});
