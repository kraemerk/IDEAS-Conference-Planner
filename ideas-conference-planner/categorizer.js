// functions to allow for the manipulation of the current
// presentation category to be changed

function displayEntry(row) {
	ipc.send('display-entry');
	var title = row[1];
	var header = document.getElementById('categorizedTitle');
	header.append(title);
}

function updateCategorgy(rowID) {
	ipc.send('update-category', rowID);
}