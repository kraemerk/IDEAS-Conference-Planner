const ipc = require('electron').ipcRenderer;

var categoryList;

//category countlist is used
//to keep track of the number of presentations
//that have category specified by categoryCounter
var categoryCountList;
var categoryCounter;

var editCategoryFlag;

var selectedCategory;
var tb = null;

function getAttendeeName(attendee) {

  return attendee == null ? "" : (attendee.prefix == null ? "" : attendee.prefix) + ' ' + attendee.first + ' ' + attendee.last;

}

function getReviewer(review) {
  if (review[0] != null) {
    reviewer = review[0].ReviewReviewer;
    return reviewer.first + ' ' + reviewer.last;
  } else {
    return '';
  }
}

function getReview(review) {
  if (review[0] != null) {
    review = review[0]
    totalscore = review.content_rating+review.credibility_rating+review.grammar_rating+review.interest_rating+review.novelty_rating+review.overall_rating+review.title_rating;
    return totalscore + '/21';
  } else {
    return '';
  }
}


function ratePresentation(rowID, presID) {
  var button = document.createElement('button');
  button.textContent = 'Rate';
  var actionSpace = document.getElementById('actions' + rowID);

  button.addEventListener('click', () => {
    // stores the raw html data for the row in session storage.
    sessionStorage.presTitle = document.getElementById(rowID).cells[2].innerHTML;
    sessionStorage.presDesc = document.getElementById(rowID).cells[3].innerHTML;
    sessionStorage.presObj1 = document.getElementById(rowID).cells[4].innerHTML;
    sessionStorage.presObj2 = document.getElementById(rowID).cells[5].innerHTML;
    sessionStorage.presObj3 = document.getElementById(rowID).cells[6].innerHTML;
    sessionStorage.presID = presID;
    window.location = "index-rating.html";
  }, false)

  actionSpace.appendChild(button);
}




function ratePresentation(rowID) {

  var button = document.createElement('button');

  button.textContent = 'Rate';

  var actionSpace = document.getElementById('actions' + rowID);



  button.addEventListener('click', () => {

    window.location = 'index-rating.html'

  }, false);



  actionSpace.appendChild(button);

}

function getCategoryIdFromName(categoryName) {
  if (categoryName == null) {
    return "";
  }

  for (var i = 0; i < categoryList.length; ++i) {
    if (categoryList[i].title == categoryName) {
      return categoryList[i].id;
    }
  }
}

function getCategoryFromId(categoryID) {
  // alert('hello');
  if (categoryID == null)
    return "";

  for (var i = 0; i < categoryList.length; ++i) {
    if (categoryList[i].id == categoryID) 
      return categoryList[i].title;
  }
  return "";
}

function populateCategoryCountList() {
  
  //so that javascript knows this is an array
  categoryCountList = [];


  for (i = 0; i < categoryList.length; i++ ) {
    var newCatCount = ipc.sendSync('get-category-count', categoryList[i].id);
    categoryCountList.push(newCatCount);
  }  
}

function addCategorization(rowID) {

  
  var dropDownSpace = document.getElementById('dropDownSpace' + rowID);
  var currentCategorySpace = document.getElementById('currentCategorySpace' + rowID);


  //creates the dropdown menu and id's it by the row
  var dropDownMenu = document.createElement("SELECT");
  dropDownMenu.id = "categoryDropDown" + rowID;

  var option = document.createElement('option');
  option.text = 'Select Category';
  dropDownMenu.add(option);

  //loops for every category in category list and
  //ads a dropdown option for each one
  for (i = 0; i < categoryList.length; i++) {
    option = document.createElement('option');
    option.text = categoryList[i].title;
    dropDownMenu.add(option);
  }

  //when the option is changed, send the query that sets the 
  //selected locations category
  dropDownMenu.onchange = function() {
    selectedCategory = dropDownMenu.options[dropDownMenu.selectedIndex].text;
    dropDownMenu.value = selectedCategory;
    currentCategorySpace.innerHTML = selectedCategory;
    var sIndex = dropDownMenu.selectedIndex - 1;

    ipc.send('set-category',
      {"presentation":document.getElementById(rowID).cells[2].innerHTML,
      "category":categoryList[sIndex].id});

    //when the category is changed, the categorycount list must be reinitialized
    location.reload();
  }

  dropDownSpace.appendChild(dropDownMenu);



}







//this function handles adding the buttons
//to the selected category in the edit categories modal window
function addCategorizationActions(rowID) {

  // alert('Adding categorization actions');
  var catActions = document.getElementById('categoryActions' + rowID);
  var catTitle = categoryList[rowID].title;
  var catTable = document.getElementById('categoriesTable');


  //create the edit button
  var editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.id = 'editCategory' + rowID;
 
  //create the delete button
  var deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.id = 'deleteCategory' + rowID;

  //gets the number of presentations in order to check if delete button should be added
  var presentationCount = document.getElementById('presentationCount' + rowID).innerHTML;
  // presentationCount.innerHTML = categoryCountList[rowID];


  //when the edit button is clicked the user should be allowed to modify the text
  //in the selected category and they will be shown a button to save and a button to cancel
  editButton.onclick = function () {
    editCategoryFlag = true;
    categoryList = JSON.parse(ipc.sendSync('get-categories', ''));
    populateCategoryCountList();
    refreshPresentations();
    //first - turn the category title space into a textbox
    var catTitleSpace = document.getElementById('categoryValue' + rowID);
    var oldText = catTitleSpace.innerHTML;
    catTitleSpace.innerHTML = '';

    var editTextBox = document.createElement('INPUT');
    editTextBox.id = 'editTextBox' + rowID;
    editTextBox.defaultValue = oldText;
    catTitleSpace.appendChild(editTextBox);

    //second - change the buttons in the catActions space
    catActions.innerHTML = '';
    //the first one is save
    var saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    catActions.appendChild(saveButton);

    //the second one is cancel
    var cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    catActions.appendChild(cancelButton);

    //third - if they press save, change textbox to new text and update the actual value
    saveButton.onclick = function() {
      var newText = editTextBox.value;

      //if the value hasn't changed do the same as cancel button
      if (newText == oldText) {
        editCategoryFlag = false;
        catTitleSpace.innerHTML = '';
        catTitleSpace.innerHTML = oldText;
        catActions.innerHTML = '';
        catActions.appendChild(editButton);

        if (presentationCount == 0) {
          catActions.appendChild(deleteButton);
        }
      //the value is new so update it in the database and the table
      } else {
        //change the category value in the database
        var newSavedName = ipc.sendSync('update-category-name',
          {"categoryId": getCategoryIdFromName(oldText),
          "newValue": newText});
            
        categoryList = JSON.parse(ipc.sendSync('get-categories', ''));
        populateCategoryCountList();
        refreshPresentations();
        
        editCategoryFlag = false;
        //change the value in the table
        catTitleSpace.innerHTML = newText;
        
        
        //reset the buttons
        catActions.innerHTML = '';
        catActions.appendChild(editButton);
        if (presentationCount == 0) {
          catActions.appendChild(deleteButton);
        }

      }
    }

    //fourth - if they press cancel, change textbox to old text
    cancelButton.onclick = function() {
      editCategoryFlag = false;
      catTitleSpace.innerHTML = '';
      catTitleSpace.innerHTML = oldText;
      catActions.innerHTML = '';
      catActions.appendChild(editButton);

      if (presentationCount == 0) {
        catActions.appendChild(deleteButton);
      }
    }
  }

  //the edit button is added to the selected row
  catActions.appendChild(editButton);


  //if there are zero presentations
  //delete the category with a query
  //and redraw the table without the old category
  if (presentationCount == 0) {
    deleteButton.onclick = function() {
      var cID = getCategoryIdFromName(catTitle);
      // alert('cid: ' +cID);
      // alert('rowID: ' + rowID);
      // catTable.deleteRow(rowID+1);
      // alert('deletedrow');

      //delete it and recalculate the category list and
      //category count list
      // ipc.sendSync('delete-category', cID);
      // categoryList = JSON.parse(ipc.sendSync('get-categories', ''));
      // populateCategoryCountList();
      
    }
    catActions.appendChild(deleteButton);

  }

  
  
}

function editCategory() {
    
  //get the table inside the modal window and resets it to nothing
  //as well as the paragraph 
  var categoryTable = document.getElementById('categoriesTable');    
  var pEntry = document.getElementById('pEntry');
  
  var newCatBtnDiv = document.getElementById('newCatBtnDiv');
  newCatBtnDiv.innerHTML = '';
  var newCategoryButton = document.createElement('button');
  newCategoryButton.textContent = '+ New Category';

  newCategoryButton.onclick = function() {
    var newCatInput = document.getElementById('newCatInput');

    if (newCatInput.value == "")
      return;

    //first- insert a row into the database
    var id = ipc.sendSync('add-category', newCatInput.value);
    if (id == -1)
      return;

    //second- update table.

    //create a new row and give it id i
    var i = categoryTable.rows.length - 1;
    var newRow = categoryTable.insertRow(i+1);
    newRow.id = i;

    //this cell will hold the category value at categorylist[i]
    var td = document.createElement('td');
    td.id = 'categoryValue' + i;
    td.appendChild(document.createTextNode(newCatInput.value));
    newCatInput.value = "";
    newRow.appendChild(td);


    //this cell will hold the number of presentations with category categorylist[i]
    var td = document.createElement('td');

    td.id = 'presentationCount' + i;
    td.appendChild(document.createTextNode('0'));
    newRow.appendChild(td);


    //this cell will hold the space to do the actions on the selected category
    var td = document.createElement('td');
    td.id = 'categoryActions' + i;
    newRow.appendChild(td);

    tb = null;

    //when the row is clicked highlight it and add the possible actions to
    newRow.onclick= function () {
      if (tb == null){
        tb = this;
        this.style.backgroundColor = this.origColor;
        this.origColor=this.style.backgroundColor;
        this.style.backgroundColor='#BCD4EC';
        this.hilite = true;
        if (editCategoryFlag) {
          editCategoryFlag = false;
        }
        addCategorizationActions(this.id);
      } else {
        tb.style.backgroundColor=tb.origColor;
        tb.hilite = false;
        this.style.backgroundColor = this.origColor;
        this.origColor=this.style.backgroundColor;
        this.style.backgroundColor='#BCD4EC';
        this.hilite = true;
        var categoryActionSpace = document.getElementById('categoryActions' + tb.id);
        var presentationCountSpace = document.getElementById('presentationCount' + tb.id);
        if (editCategory) {
          editCategoryFlag = false;
        }
        if (tb != this) {
          categoryActionSpace.innerHTML = '';
          addCategorizationActions(this.id);
        } 
        tb = this;            
      }
    }
  }

  newCatBtnDiv.appendChild(newCategoryButton);


  pEntry.innerHTML = '';
  categoryTable.innerHTML = '';


  //get ready to loop to add each category
  var length = categoryList.length;
  var numRows = length;

  //create the top row of the table with the column headings
  var topRow = categoryTable.insertRow(0);

  //header for the category name
  var th = document.createElement('th');
  th.appendChild(document.createTextNode('Category Name'));
  topRow.appendChild(th);

  //header for the number of presentations
  th = document.createElement('th');
  th.appendChild(document.createTextNode('# of Presentations'));
  topRow.appendChild(th);

  //header for the possible actions
  th = document.createElement('th');
  th.appendChild(document.createTextNode('Actions'));
  topRow.appendChild(th);


  for (i = 0; i < length; i++) {

    //create a new row and give it id i
    var newRow = categoryTable.insertRow(i+1);
    newRow.id = i;

    //this cell will hold the category value at categorylist[i]
    var td = document.createElement('td');
    td.id = 'categoryValue' + i;
    td.appendChild(document.createTextNode(categoryList[i].title));
    newRow.appendChild(td);


    //this cell will hold the number of presentations with category categorylist[i]
    var td = document.createElement('td');

    td.id = 'presentationCount' + i;
    td.appendChild(document.createTextNode(categoryCountList[i]));
    newRow.appendChild(td);


    //this cell will hold the space to do the actions on the selected category
    var td = document.createElement('td');
    td.id = 'categoryActions' + i;
    newRow.appendChild(td);

    tb = null;

    //when the row is clicked highlight it and add the possible actions to
    newRow.onclick= function () {
      if (tb == null){
        tb = this;
        this.style.backgroundColor = this.origColor;
        this.origColor=this.style.backgroundColor;
        this.style.backgroundColor='#BCD4EC';
        this.hilite = true;
        addCategorizationActions(this.id);
      } else {
        tb.style.backgroundColor=tb.origColor;
        tb.hilite = false;
        this.style.backgroundColor = this.origColor;
        this.origColor=this.style.backgroundColor;
        this.style.backgroundColor='#BCD4EC';
        this.hilite = true;
        var categoryActionSpace = document.getElementById('categoryActions' + tb.id);
        var presentationCountSpace = document.getElementById('presentationCount' + tb.id);
        
        if (tb != this) {
          // alert('tb != this');
          if (editCategoryFlag) {
            // alert('editCategoryFlag = true');

            var editTextBox = document.getElementById('editTextBox' + tb.id);
            var oldText = editTextBox.value;


            var categoryValueSpace = document.getElementById('categoryValue' + tb.id);
            categoryValueSpace.innerHTML = oldText;
            editCategoryFlag = false;
          }

          categoryActionSpace.innerHTML = '';
          addCategorizationActions(this.id);
          
        } 
        tb = this;            
      }
    }
  }

  //display the modal window and define the span as anything outside it
  var modal = document.getElementById('myModal');
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";

  //if something outside the window is clicked close the modal window
  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}


function generateTable(data) {

  

  var presentationDiv = document.getElementById('presentationDiv');
  var table = document.createElement('table');
  table.id = 'PresentationTable';
  table.setAttribute('border','1');
  table.setAttribute('width','100%');
  table.setAttribute('id', 'table');
  
  var numRows = data.length;
  var row = table.insertRow(0);
  
  var th = document.createElement('th');
  th.appendChild(document.createTextNode('Actions'));
  row.appendChild(th);
  
  th = document.createElement('th');
  th.appendChild(document.createTextNode('Date'));
  row.appendChild(th);
  th.onclick= function(){sortTable(1);} ;

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Title'));
  th.onclick= function(){sortTable(2);} ;
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

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Rating 1'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Rating 2'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Category'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Reviewer'));
  row.appendChild(th);

  th = document.createElement('th');
  th.appendChild(document.createTextNode('Review'));
  row.appendChild(th);

  for (i = 0; i < numRows; ++i) {

    var row = table.insertRow(i + 1);
    row.id =  i;

    var td = document.createElement('td');
    td.id = 'actions' + i;
    td.appendChild(document.createTextNode(''));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(data[i].submission_date.slice(0, 10)));
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
    td.appendChild(document.createTextNode(getAttendeeName(data[i].Presenter)));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getAttendeeName(data[i].Copresenter1)));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getAttendeeName(data[i].Copresenter2)));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getAttendeeName(data[i].Copresenter3)));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getAttendeeName(data[i].Rating1)));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getAttendeeName(data[i].Rating2)));
    row.appendChild(td);

    //this creates the td for the category space
    td = document.createElement('td');
    td.id = 'categorySpace' + i;

    var currentCategorySpace = document.createElement('div');
    currentCategorySpace.id = 'currentCategorySpace' + i;
    var actualCategory = document.createTextNode(getCategoryFromId(data[i].category_id));
    currentCategorySpace.appendChild(actualCategory);

    var dropDownSpace = document.createElement('div');
    dropDownSpace.id = 'dropDownSpace' + i;

    td.appendChild(currentCategorySpace);
    td.appendChild(dropDownSpace);

    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getReviewer(data[i].PresentationReview)));
    row.appendChild(td);

    td = document.createElement('td');
    td.appendChild(document.createTextNode(getReview(data[i].PresentationReview)));
    row.appendChild(td);
    row.onclick= function () {
         
      if (tb == null){
        tb = this;
        this.style.backgroundColor = this.origColor;
        this.origColor=this.style.backgroundColor;
        this.style.backgroundColor='#BCD4EC';
        this.hilite = true;
        ratePresentation(this.id, data[this.id].id);
        addCategorization(this.id);
      } else {
        tb.style.backgroundColor=tb.origColor;
        tb.hilite = false;
        
        this.style.backgroundColor = this.origColor;
        //this.hilite = false;
        this.origColor=this.style.backgroundColor;
        this.style.backgroundColor='#BCD4EC';
        this.hilite = true;
        var actionSpace = document.getElementById('actions' + tb.id);
        
        if (tb != this) {
          var dropDownSp = document.getElementById('dropDownSpace' + tb.id);
          dropDownSp.innerHTML = '';
          selectedCategory = null;
          addCategorization(this.id);
        } 
        tb = this;

        actionSpace.innerHTML = '';
        ratePresentation(this.id);
      }
    }

    row.ondblclick = function() {

      var pEntry = document.getElementById('pEntry');
      var catTable = document.getElementById('categoriesTable');
      catTable.innerHTML ='';
      pEntry.innerHTML = '';
      var length = this.cells.length - 1;
      var nextCell = document.createElement('p');
      
      for (i = 0; i < length; i++) {
        if (i != 13 && i != 0) {
          nextCell.innerHTML = this.cells[i].innerHTML;
          pEntry.appendChild(nextCell);
          nextCell = document.createElement('p');
        }
      }

      var modal = document.getElementById('myModal');
      var span = document.getElementsByClassName("close")[0];

      modal.style.display = "block";


      span.onclick = function() {
        modal.style.display = "none";
      }

      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
    }
  }

  presentationDiv.innerHTML = '';

  presentationDiv.appendChild(table);
}




function pageLoad() {
  refreshPresentations();
  categoryList = JSON.parse(ipc.sendSync('get-categories', ''));
  populateCategoryCountList();

}

function refreshPresentations() {

  ipc.send('query-presentations', '');

}

document.addEventListener('DOMContentLoaded', pageLoad);


document.getElementById("getjotfile").addEventListener("change", ingestCSV);



function ingestCSV() {

  var jotfile = document.getElementById("getjotfile");

  ipc.send('ingest-csv', jotfile.files[0].path);

}



ipc.on('ingest-csv', function(event, arg) {

  alert(arg);

});



ipc.on('delete-category-reply', function(event, arg) {
  ipc.send('get-categories', '');
})





ipc.on('query-presentations-reply', function(event, arg) {

  var query = JSON.parse(arg);

  generateTable(query);
});

function sortTable(n) {
        console.log("sorting")
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("table");
        switching = true;
        dir = "asc";
        while (switching) {
            switching = false;
            rows = table.getElementsByTagName("tr");
            for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch= true;
                break;
            }
        } else if (dir == "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch= true;
            break;
            }
        }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
        if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
        }
        }
        }
    }
function searchFunc() {
  // Declare variables
  console.log("searching");
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}