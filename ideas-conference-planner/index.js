const ipc = require('electron').ipcRenderer;

function generateTable(data) {
  var presentationDiv = document.getElementById('presentationDiv');
  var table = document.createElement('table');
  table.setAttribute('border','1');
  table.setAttribute('width','100%');
  var numRows = (data.length < 5) ? data.length : 5;
  var row = table.insertRow(0);

  var th = document.createElement('th');
  th.appendChild(document.createTextNode('Date'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Title'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Description'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Objective 1'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Objective 2'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Objective 3'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Presenter'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Co-Presenter 1'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Co-Presenter 2'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Co-Presenter 3'));
  row.appendChild(th);

  for (i = 0; i < numRows; ++i) {
    var row = table.insertRow(i + 1);
    var td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].submission_date));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].title));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].description));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].objective_1));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].objective_2));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].objective_3));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].Presenter.prefix + ' ' + data[i].Presenter.first + ' ' + data[i].Presenter.last ));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].Copresenter1.prefix + ' ' + data[i].Copresenter1.first + ' ' + data[i].Copresenter1.last ));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].Copresenter2.prefix + ' ' + data[i].Copresenter2.first + ' ' + data[i].Copresenter2.last ));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].Copresenter3.prefix + ' ' + data[i].Copresenter3.first + ' ' + data[i].Copresenter3.last ));
    row.appendChild(td);

  }
  presentationDiv.innerHTML = '';
  presentationDiv.appendChild(table);
}

function refreshPresentations() {
  ipc.send('query-presentations', '');
}

//document.addEventListener('DOMContentLoaded', generateTable); //should be refreshPresentations
document.addEventListener('DOMContentLoaded', refreshPresentations);

ipc.on('query-presentations-reply', function(event, arg) {
  var query = JSON.parse(arg);
  console.log(query);
  generateTable(query);
})

/*
build table using correct indexing into sql results
actually be able to retrieve sql results using ipc
merge two branches
*/
