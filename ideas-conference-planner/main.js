const { app, BrowserWindow } = require('electron');

function createWindow () {
  win = new BrowserWindow({ width: 800, height: 600 });
  win.loadFile('index.html');
}

function ingestCSV (file) {
  var csv = require('csv-streamify');
  var fs = require('fs');

  var options = {
    delimiter : ',',
    endLine : '\n',
    quote : '`',
    empty : '',
    columns: true
  }

  var csvStream = csv(options);

  fs.createReadStream(file).pipe(csvStream)
    .on('error', function(err) {
      console.error(err);
    })
    .on('data',function(data) {
      console.log(data);
    })
}

ingestCSV('/home/micah/Documents/School-Work/CS3312/presentations.csv');

app.on('ready', createWindow);
