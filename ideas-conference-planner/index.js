const ipc = require('electron').ipcRenderer;

function generateTable(data) {
  var presentationDiv = document.getElementById('presentationDiv');
  var table = document.createElement('table');
  table.setAttribute('border','1');
  table.setAttribute('width','100%');
  for (i = 0; i < 10; ++i) {
    var row = table.insertRow(i);
    for(j = 1; j < 10; ++j) {
      var text = document.createTextNode(String.fromCharCode(j + 64));
      var cell = row.insertCell(j - 1);
      cell.setAttribute('align','center');
      cell.appendChild(text);
    }
  }
  presentationDiv.innerHTML = '';
  presentationDiv.appendChild(table);
}

function refreshPresentations() {
  ipc.send('query-presentations', '');

  //build the table
  //generateTable();
}

//document.addEventListener('DOMContentLoaded', generateTable); //should be refreshPresentations
document.addEventListener('DOMContentLoaded', refreshPresentations);

ipc.on('query-presentations-reply', function(event, arg) {
  var query = JSON.parse(arg);
  generateTable(query);
  console.log(query);
})

/*
build table using correct indexing into sql results
actually be able to retrieve sql results using ipc
merge two branches
*/
