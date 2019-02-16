const remote = require('electron');
const main = remote.require('./index.js');

var button = document.createElement('button');
button.textContent = 'Return to Presentations';
button.addEventListener('click', () => {
  var window = remote.getCurrentWindow();
  main.openWindow('index');
  window.close();
}, false)
document.body.appendChild(button);
