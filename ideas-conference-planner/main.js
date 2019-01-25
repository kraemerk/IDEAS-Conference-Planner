var fs = require('fs');
var config;
const { app, BrowserWindow } = require('electron');

function createWindow () {
  win = new BrowserWindow({ width: 800, height: 600 });
  win.loadFile('index.html');
}

function getDB () {
  const Sequelize = require('sequelize');
  ini = require('ini');

  config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
  console.log(config.database.user);
  const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
    dialect: 'postgres',
    host: config.database.host,
    port: config.database.port,
    operatorsAliases: false
  });
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
}

function ingestCSV (file) {
  var csv = require('csv');

  var options = {
    columns: true,
    trim: true,
    rtrim: true
  }

  var parser = csv.parse(options);

  getDB();

  var transform = csv.transform(function(row) {
    var presenter = {
      prefix: row['Prefix'],
      first: row['First Name'],
      last: row['Last Name'],
      email: row['Primary Presenter E-mail']
    };
    console.log(presenter);
  });

  fs.createReadStream(file).pipe(parser).pipe(transform);
    // .on('error', function(err) {
    //   console.error(err);
    // })
    // .on('data',function(row) {
    //   console.log(row);
    // })
}

ingestCSV('/home/micah/Documents/School-Work/CS3312/presentations.csv');

app.on('ready', createWindow);
