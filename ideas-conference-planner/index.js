const ipc = require('electron').ipcRenderer;

var clickedCategory = false;

var clickedEdit = false;

var changedValue = false;

var categoryList;

var selectedCategory;

var tb = null;

function getAttendeeName(attendee) {

  return attendee == null ? "" : (attendee.prefix == null ? "" : attendee.prefix) + ' ' + attendee.first + ' ' + attendee.last;

}

function getCategoryFromId(categoryID) {
  console.log(categoryID);
  if (categoryID == null)
    return "";

  for (var i = 0; i < categoryList.length; ++i) {
    if (categoryList[i].id == categoryID) 
      return categoryList[i].title;
  }
  return "";
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



function addCategorization(rowID) {

  
  var dropDownSpace = document.getElementById('dropDownSpace' + rowID);
  var currentCategorySpace = document.getElementById('currentCategorySpace' + rowID);


  //creates the dropdown menu and id's it by the row

  var dropDownMenu = document.createElement("SELECT");

  dropDownMenu.id = "categoryDropDown" + rowID;


  for (i = 0; i < categoryList.length; i++) {

    var option = document.createElement('option');

    option.text = categoryList[i].title;

    dropDownMenu.add(option);

  }

  dropDownMenu.onchange = function() {

    selectedCategory = dropDownMenu.options[dropDownMenu.selectedIndex].text;

    dropDownMenu.value = selectedCategory;
    
    currentCategorySpace.innerHTML = selectedCategory;

    ipc.send('set-category',
      {"presentation":document.getElementById(rowID).cells[2].innerHTML,
      "category":categoryList[dropDownMenu.selectedIndex].id});
  }

  dropDownSpace.appendChild(dropDownMenu);



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

function getPresentationsCount(category) {
  return 0;
}

function addCategorizationActions(rowID) {


}

function createCategoryEditing() {
  var editButton = document.createElement('button');
  editButton.textContent = 'Edit Categories';
  editButton.id = 'editCategoriesButton';
  var editDiv = document.getElementById('editCategoriesDiv');
  editCategoriesDiv.appendChild(editButton);

  editButton.onclick= function () {

    

    var categoryTable = document.getElementById('categoriesTable');    
    categoryTable.innerHTML = '';

    var length = categoryList.length;
    

    // categoryTable.id = 'CategoryTable';
    categoryTable.setAttribute('border','1');
    categoryTable.setAttribute('width','100%');
    // categoryTable.setAttribute('id', 'table');
    var numRows = length;

    var topRow = categoryTable.insertRow(0);

    var th = document.createElement('th');

    th.appendChild(document.createTextNode('Category Name'));
    topRow.appendChild(th);

    th = document.createElement('th');
    th.appendChild(document.createTextNode('# of Presentations'));
    topRow.appendChild(th);

    
    th = document.createElement('th');
    th.appendChild(document.createTextNode('Actions'));
    topRow.appendChild(th);


      for (i = 0; i < length; i++) {
        if (i != 0) {


          var newRow = categoryTable.insertRow(i);
          newRow.id = 'categoryTable' i;

          //this cell will hold the category value at categorylist[i]
          var td = document.createElement('td');
          td.id = 'categoryValue' + i;
          td.appendChild(document.createTextNode(categoryList[i].title));
          newRow.appendChild(td);


          //this cell will hold the number of presentations with category categorylist[i]
          var td = document.createElement('td');
          td.id = 'presentationCount' + i;
          td.appendChild(document.createTextNode(getPresentationsCount(categoryList[i])));
          newRow.appendChild(td);



          //this cell will hold the space to do the actions on the selected category
          var td = document.createElement('td');
          td.id = 'categoryActions' + i;
          td.appendChild(editDiv);
          td.appendChild(deleteDiv);
          newRow.appendChild(td);

          tb = null;

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
              //this.hilite = false;
              this.origColor=this.style.backgroundColor;
              this.style.backgroundColor='#BCD4EC';
              this.hilite = true;
              var actionSpace = document.getElementById('categoryActions' + tb.id);
              
              if (tb != this) {
                actionSpace.innerHTML = '';
                addCategorizationActions(this.id);
              } 
              tb = this;            
            }
          }
          // alert(categoryList[i].title);
        }
      }

      var modal = document.getElementById('myModal');
      // modal.appendChild(categoriesTable);

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
  createCategoryEditing();

}


function pageLoad() {
  ipc.send('get-categories', '');
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



ipc.on('get-categories-reply', function(event, arg) {
  categoryList = JSON.parse(arg);
  refreshPresentations();
});



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
