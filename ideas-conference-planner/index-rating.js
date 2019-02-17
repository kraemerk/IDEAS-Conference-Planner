
var ratingDiv = document.getElementById('ratingDiv');

var td = document.createElement('td');
td.appendChild(document.createTextNode(sessionStorage.row));
ratingDiv.appendChild(td);
