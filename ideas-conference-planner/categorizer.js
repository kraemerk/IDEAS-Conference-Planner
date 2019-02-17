window.alert('hello\n' + sessionStorage.row);

function displayEntry() {
	var para = document.createElement("p");
	var node = document.createTextNode(sessionStorage.row);
	para.appendChild(node);
}

// document.addEventListener('DOMContentLoaded', displayEntry);