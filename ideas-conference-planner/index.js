const ipc = require('electron').ipcRenderer;



var clickedCategory = false;

var clickedEdit = false;

var changedValue = false;



var categoryList;

var selectedCategory;





function getAttendeeName(attendee) {

  return attendee == null ? "" : (attendee.prefix == null ? "" : attendee.prefix) + ' ' + attendee.first + ' ' + attendee.last;

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

  //gets the place where the items are to be added

  var categorySpace = document.getElementById('categorySpace' + rowID);

  clickedCategory = false;

  clickedEdit = false;

  changedValue = false;



  // selectedCategory = categorySpace.innerHTML;

  ipc.send('get-categories', '');

  



  //creates the dropdown menu and id's it by the row

  var dropDownMenu = document.createElement("SELECT");

  dropDownMenu.id = "categoryDropDown" + rowID;

  dropDownMenu.options[dropDownMenu.selectedIndex] = categorySpace.innerHTML;

  

  //-------------------------------------------------------------------------------------> MICAH: add all entries in category table

  //loop for every category and add an option

  //for each one



  for (i = 0; i < categoryList.length; i++) {

    var option = document.createElement('option');

    option.text = categoryList[i].title;

    dropDownMenu.add(option);

  }



  

  //create edit button with edit picture

  var editButton = document.createElement('button');

  editButton.innerHTML = "<img src='images/editCategories.png'/>";

  

  //when dropdown is clicked set the category value to the selected item

  dropDownMenu.onclick = function() {

    clickedCategory = true;

  }



  //when the value of the dropdown is changed

  //the whole window should not reload

  dropDownMenu.onchange = function() {

    changedValue = true;

    selectedCategory = dropDownMenu.options[dropDownMenu.selectedIndex].text;

    dropDownMenu.value = selectedCategory;

  



    //----------------------------------------------------------------------------------------> MICAH: change the value of the presentation's category

    //do sql query to change the value of the selected presentation's category

    ipc.send('set-category',
      {"presentation":document.getElementById(rowID).cells[2].innerHTML,
      "category":categoryList[dropDownMenu.selectedIndex].id});
  }



  dropDownMenu.onblur = function() {

    changedValue = false;

    clickedEdit = false;

    clickedCategory = false;

  }



  editButton.onblur = function() {

    changedValue = false;

    clickedEdit = false;

    clickedCategory = false;

  }







  editButton.onclick = function() {

    clickedEdit = true;

    editCategories();

  }



  //add dropdown to the category space

  categorySpace.appendChild(dropDownMenu);



  //add the edit button to the category space

  categorySpace.appendChild(editButton);





}



function generateTable(data) {

  var presentationDiv = document.getElementById('presentationDiv');

  var table = document.createElement('table');

  table.id = 'PresentationTable';



  table.setAttribute('border','1');

  table.setAttribute('width','100%');

  var numRows = data.length;

  var row = table.insertRow(0);







  var th = document.createElement('th');

  th.appendChild(document.createTextNode('Actions'));

  row.appendChild(th);



  th = document.createElement('th');

  th.appendChild(document.createTextNode('Date'));

  row.appendChild(th);



  th = document.createElement('th');

  th.appendChild(document.createTextNode('Title'));

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





    //-------------------------------------------------------------------------------------------->MICAH: show the category of the current presentation

    td = document.createElement('td');

    td.id = 'categorySpace' + i;

    row.appendChild(td);



    row.onclick= function () {

      //if the row is not highlighted

      if(!this.hilite){

        var row = this;

        row.style.backgroundColor = this.origColor;

        row.hilite = false;



        //when a row that was not highlighted

        //is clicked, the whole process is restarted

        clickedCategory = false;

        clickedEdit = false;

        changedValue = false;





        

        this.origColor=this.style.backgroundColor;

        this.style.backgroundColor='#BCD4EC';

        this.hilite = true;

        ratePresentation(this.id);

        addCategorization(this.id);

      

      //if the row is highlighted

      } else {

        // if the select has not been chosen or

        // the edit button has not been chosen or

        // the input box has not been changed

        //reset everything

        if (!clickedCategory && !clickedEdit && !changedValue) {

          this.style.backgroundColor=this.origColor;

          this.hilite = false;

          var actionSpace = document.getElementById('actions' + this.id);

          actionSpace.innerHTML = '';

          var categorySpace = document.getElementById('categorySpace' + this.id);

          categorySpace.innerHTML = selectedCategory;

          

        }

      }

    }



    row.ondblclick = function() {

      var actionSpace = document.getElementById('actions' + this.id);

      actionSpace.innerHTML = '';

      var pEntry = document.getElementById('pEntry');



      pEntry.innerHTML = '';

      var length = this.cells.length - 1;

      var nextCell = document.createElement('p');

            

      for (i = 0; i < length; i++) {

        nextCell.innerHTML = this.cells[i].innerHTML;

        pEntry.appendChild(nextCell);

        nextCell = document.createElement('p');

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





function refreshPresentations() {

  ipc.send('query-presentations', '');

}



document.addEventListener('DOMContentLoaded', refreshPresentations);



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

});



ipc.on('query-presentations-reply', function(event, arg) {

  var query = JSON.parse(arg);

  generateTable(query);

});