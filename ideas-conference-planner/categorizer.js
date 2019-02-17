// window.alert('hello\n' + sessionStorage.row);

function displayEntry() {
	var para = document.getElementById("para1");
	para.innerHTML = sessionStorage.row;
	document.body.appendChild(para);
}

document.addEventListener('DOMContentLoaded', displayEntry);