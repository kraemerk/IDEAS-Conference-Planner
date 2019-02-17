
var titleDiv = document.getElementById('titleDiv');
var descDiv = document.getElementById('descDiv');
var objDiv = document.getElementById('objDiv');

var td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presTitle));
titleDiv.appendChild(td);

var td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presDesc));
descDiv.appendChild(td);

var td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presObj1));
objDiv.appendChild(td);

var td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presObj2));
objDiv.appendChild(td);

var td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presObj3));
objDiv.appendChild(td);
