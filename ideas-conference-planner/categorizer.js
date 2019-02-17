
function displayEntry() {
	var para = document.getElementById("para1");

	para.innerHTML = sessionStorage.row;

	document.body.appendChild(JSON.parse(para));
}

document.addEventListener('DOMContentLoaded', displayEntry);