// functions to allow for the manipulation of the current
// presentation category to be changed

function displayEntry(row) {
	var header = document.createElement("header"),
		h1 = document.createElement("h1");

	header.textContent = "helloKitty";
	header.appendChild(h1);
	document.body.appendChild(header);
}

document.addEventListener('DOMContentLoaded', displayEntry);