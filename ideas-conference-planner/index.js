const ipc = require('electron').ipcRenderer;

function generateTable(queryResults) {
  var presentationDiv = document.getElementById('presentationDiv');
  var table = document.createElement('table');
  table.setAttribute('border','1');
  table.setAttribute('width','100%');
  for (i = 0; i < 10; ++i) {
    var row = table.insertRow(i);
    for(j = 1; j < 10; ++j) {
      var text = "buildmytable";
      var cell = row.insertCell(j - 1);
      cell.setAttribute('align','center');
      cell.appendChild(text);
    }
  }
  presentationDiv.innerHTML = '';
  presentationDiv.appendChild(table);
}

function refreshPresentations() {
  ipc.send('query-presentations');
}

document.addEventListener('DOMContentLoaded', refreshPresentations); //should be refreshPresentations

ipc.on('presentation-data', function(event, arg) {
  //build the table
  //generateTable();
  generateTable(queryResults);
})

/*
build table using correct indexing into sql results
actually be able to retrieve sql results using ipc
merge two branches
*/
