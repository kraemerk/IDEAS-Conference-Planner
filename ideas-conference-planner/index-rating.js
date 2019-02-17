
var ratingDiv = document.getElementById('ratingDiv');

var td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presTitle));
ratingDiv.appendChild(td);

var td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presDesc));
ratingDiv.appendChild(td);

var td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presObj1));
ratingDiv.appendChild(td);

var td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presObj2));
ratingDiv.appendChild(td);

var td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.presObj3));
ratingDiv.appendChild(td);
