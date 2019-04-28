var fs = require('fs');
const Sequelize = require('sequelize');
var config;
const electron = require('electron');
const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain;
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

ini = require('ini');

// load configuration file
config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

// create sequelize connection to the database
const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
  dialect: 'postgres',
  host: config.database.host,
  port: config.database.port,
  operatorsAliases: false,
  logging: false
});

// define a category object as defined in the database
const Category = sequelize.define('category', {
  id: {
    type: Sequelize.TEXT,
    primaryKey: true,
    autoIncrement: true,
  },
  title: Sequelize.TEXT
}, {
  schema: config.database.schema,
  freezeTableName: true,
  timestamps: false
});

// define an attendee object as defined in the database
const Attendee = sequelize.define('attendee', {
  prefix: Sequelize.TEXT,
  first: Sequelize.TEXT,
  last: Sequelize.TEXT,
  email: Sequelize.TEXT,
  phone: Sequelize.TEXT,
  agency: Sequelize.TEXT,
  role: Sequelize.TEXT
}, {
  schema: config.database.schema,
  freezeTableName: true,
  timestamps: false
});

// define a reviewer object as defined in the database
const Reviewer = sequelize.define('reviewer', {
  first: Sequelize.TEXT,
  last: Sequelize.TEXT
}, {
  schema: config.database.schema,
  freezeTableName: true,
  timestamps: false
});

// define a review object as defined in the database
const Review = sequelize.define('review', {
  grammar_rating: Sequelize.INTEGER,
  title_rating: Sequelize.INTEGER,
  credibility_rating: Sequelize.INTEGER,
  interest_rating: Sequelize.INTEGER,
  content_rating: Sequelize.INTEGER,
  novelty_rating: Sequelize.INTEGER,
  overall_rating: Sequelize.INTEGER
}, {
  schema: config.database.schema,
  freezeTableName: true,
  timestamps: false
});

// define a presentation object as defined in the database
const Presentation = sequelize.define('presentation', {
  submission_date: Sequelize.DATE,
  title: Sequelize.TEXT,
  description: Sequelize.TEXT,
  objective_1: Sequelize.TEXT,
  objective_2: Sequelize.TEXT,
  objective_3: Sequelize.TEXT,
  repurposed_agreement: Sequelize.BOOLEAN,
  setup_agreement: Sequelize.BOOLEAN,
  equipment_agreement: Sequelize.BOOLEAN,
  backup_agreement: Sequelize.BOOLEAN,
  timelimit_agreement: Sequelize.BOOLEAN,
  comments: Sequelize.TEXT,
  time_agreement: Sequelize.BOOLEAN,
  handout_agreement: Sequelize.BOOLEAN,
  acceptance_agreement: Sequelize.BOOLEAN,
  registration_agreement: Sequelize.BOOLEAN,
  copyright_agreement: Sequelize.BOOLEAN,
  vendor: Sequelize.BOOLEAN,
  vendor_agreement: Sequelize.BOOLEAN,
  presenter_biography: Sequelize.TEXT,
  presenter: Sequelize.TEXT,
  presenter_id: Sequelize.INTEGER,
  copresenter_1_id: Sequelize.INTEGER,
  copresenter_2_id: Sequelize.INTEGER,
  copresenter_3_id: Sequelize.INTEGER,
  category_id: Sequelize.INTEGER,
  overall_rating: Sequelize.INTEGER,
  accepted: Sequelize.BOOLEAN
}, {
  schema: config.database.schema,
  freezeTableName: true,
  timestamps: false
});


// define the foreign key relationships between the objects in the database
Presentation.belongsTo(Category, {as: 'Category', foreignKey: 'id'});

Review.belongsTo(Presentation, {as: 'PresentationReview', foreignKey: 'presentation_id'});
Review.belongsTo(Reviewer, {as: 'ReviewReviewer', foreignKey: 'reviewer_id'});

Presentation.belongsTo(Attendee, {as: 'Presenter', foreignKey: 'presenter_id'});
Presentation.belongsTo(Attendee, {as: 'Copresenter1', foreignKey: 'copresenter_1_id'});
Presentation.belongsTo(Attendee, {as: 'Copresenter2', foreignKey: 'copresenter_2_id'});
Presentation.belongsTo(Attendee, {as: 'Copresenter3', foreignKey: 'copresenter_3_id'});
Presentation.hasMany(Review, {as: 'PresentationReview', foreignKey: 'presentation_id'});

getCategories('');

function myFunction(x) {// don't delete this
  x.classList.toggle("change");
}

function createWindow () {
  let win = new BrowserWindow({ width: 800, height: 600 });
  win.loadFile('index.html');
}

exports.openWindow = (filename) => {
  let win = new BrowserWindow({width: 800, height: 600});
  win.loadURL('file://' + __dirname +'/'+ filename + '.html')﻿
}

function insertObj(sequelize, obj, insertfunc, errfunc) {
  var p = sequelize.transaction(function(t) {
    return obj.save({transaction: t}).then(insertfunc).catch(errfunc)
  });
}

// get a json of all the categories from the database
function getCategories(event) {
  Category.findAll({
    attributes: ['id', 'title'],
  }).then(categories => {
    event.returnValue =  JSON.stringify(categories);
  });
}

// ingest a CSV of presentations from JotForms into the database
function ingestCSV (file) {
  var csv = require('csv');



  // set csv options
  var options = {
    columns: true,
    trim: true,
    rtrim: true
  }

  // define csv parser
  var parser = csv.parse(options);

  // connect to database
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });


  // define csv transformation function to go from csv row to row in database
  var transform = csv.transform(function(row) {
    // set empty keys to null
    Object.keys(row).forEach((key) => {if (row[key] == '') row[key] = null});
    // build a presenter entry
    var presenter = Attendee.build({
      prefix: row['Prefix'],
      first: row['First Name'],
      last: row['Last Name'],
      email: row['Primary Presenter E-mail'],
      phone: row['Primary Presenter Contact Number'],
      agency: row['Primary Presenter Agency/School District:'],
      role: row['Which category best describes your role in your agency or school district?'],
    });
    // define function to happen after insert is successful
    var insertfunc = function(inserted) {
      // if a row is inserted successfully, get presenter ID
      var presenterId = inserted != null ? inserted.dataValues.id : null
      // build a copresenter object
      var copresenter1 = Attendee.build({
        prefix: row['Co-Presenter 1 (Prefix)'],
        first: row['Co-Presenter 1 (First Name)'],
        last: row['Co-Presenter 1 (Last Name)'],
        email: row['Co-Presenter 1'],
        agency: row['Co- Presenter 1 Agency/School District:']
      })
      // define function to happen after insert is successful
      var insertfunc = function(inserted) {
        // if there was a copresenter, check for second copresenter
        var copresenter1Id = inserted != null ? inserted.dataValues.id : null
        // create another copresenter
        var copresenter2 = Attendee.build({
          prefix: row['Co-Presenter 2 (Prefix)'],
          first: row['Co-Presenter 2 (First Name)'],
          last: row['Co-Presenter 2 (Last Name)'],
          email: row['Co-Presenter 2'],
          agency: row['Co- Presenter 2 Agency/School District:']
        })
        // define function to happen after insert is successful
        var insertfunc = function(inserted) {
          // if there was a second copresenter, check for third copresenter
          var copresenter2Id = inserted != null ? inserted.dataValues.id : null
          // create another copresenter
          var copresenter3 = Attendee.build({
            prefix: row['Co-Presenter 3 (Prefix)'],
            first: row['Co-Presenter 3 (First Name)'],
            last: row['Co-Presenter 3 (Last Name)'],
            email: row['Co-Presenter 3'],
            agency: row['Co- Presenter 3 Agency/School District:']
          })

          // define function to happen after insert is successful
          var insertfunc = function(inserted) {
            var copresenter3Id = inserted != null ? inserted.dataValues.id : null

            // create a presentation object
            var presentation = Presentation.build({
              submission_date: new Date(row['Submission Date'].replace(" ", "T") + "-05:00"),
              title: row['Session Title'],
              description: row['Session Description'],
              objective_1: row['As a result of this activity, the participant will be able to'] + " " + row['complete the learning objective with a phrase'],
              objective_2: row['As a result of this activity, the participant will be able to 2'] + " " + row['complete the learning objective'],
              objective_3: row['As a result of this activity, the participant will be able to 3'] + " " + row['complete the learning objective 2'],
              repurposed_agreement: row['complete the learning objective with a phrase'] != "No",
              setup_agreement: row['Each presentation breakout room will be setup in theatre style seating with an LCD projector, screen, power strip and extension cord'] == "Yes, I understand",
              equipment_agreement: row['I must provide my own laptop and speakers, power cord for my computer and any cords required by my computer for my presentation (e.g. HDMI or Mac cables).'] == "Yes, I agree",
              backup_agreement: row['I will have a back-up for live websites in case problems occur with Internet access.'] == "Yes, I agree",
              timelimit_agreement: row['Session are 60 minutes in length.'] == "Yes, I understand",
              comments: row['Session length comments.'],
              time_agreement: row['Presenters must be available to present June 5,6,7 and 8, 2018. The presentation may be scheduled at any time on any of the conference dates at the discretion of the conference organizers.'] == "Yes, I agree",
              handout_agreement: row['Copies of handouts and other materials available for session attendees are the responsibility of the presenter(s). However, paper handouts are not required.'] == "Yes, I understand",
              acceptance_agreement: row['The Program Committee will contact accepted presenters by email around the first week of April 2018.'] == "Yes, I understand",
              registration_agreement: row['As a presenter I must register for the conference at no charge. All co-presenter(s) must also register for the conference at no charge'] == "Yes, I agree and understand that all presenters must register for the conference.",
              copyright_agreement: row['I have obtained permission to use any copyrighted and/or personal materials (including student/client photographs) not created by me or other members of the presentation team. This permission specifically relates to the information and materials used in my presentation and includes permission to be uploaded by me on the conference program portal. These permissions are available should they be requested.'] == "Yes, I understand",
              vendor: row['Are you a vendor?'] != "No",
              vendor_agreement: row['If you are a vendor, Is your session about your product?'],
              presenter_biography: row['Please enter a short biography (15 to 100 words) highlighting your work experience and professional credentials.'],
              presenter_id: presenterId,
              copresenter_1_id: copresenter1Id,
              copresenter_2_id: copresenter2Id,
              copresenter_3_id: copresenter3Id
            })
            // insert the presentation
            insertObj(sequelize, presentation, {}, function(err) { console.log(err) });
          }
          var errfunc = function(err) {
            Attendee.findOne({ where: {prefix: copresenter3.prefix, first: copresenter3.first, last: copresenter3.last} }).then(attendee => {
              insertfunc(attendee)
            })
          }
          // insert copresenter 3
          insertObj(sequelize, copresenter3, insertfunc, errfunc);

        }
        var errfunc = function(err) {
          Attendee.findOne({ where: {prefix: copresenter2.prefix, first: copresenter2.first, last: copresenter2.last} }).then(attendee => {
            insertfunc(attendee)
          })
        }
        // insert copresenter 2
        insertObj(sequelize, copresenter2, insertfunc, errfunc);
      }
      var errfunc = function(err) {
        Attendee.findOne({ where: {prefix: copresenter1.prefix, first: copresenter1.first, last: copresenter1.last} }).then(attendee => {
          insertfunc(attendee)
        })
      }
      // insert copresenter 1
      insertObj(sequelize, copresenter1, insertfunc, errfunc);
    }
    var errfunc = function(err) {
      Attendee.findOne({ where: {prefix: presenter.prefix, first: presenter.first, last: presenter.last} }).then(attendee => {
          insertfunc(attendee)
      })
    }
    // insert presenter
    insertObj(sequelize, presenter, insertfunc, errfunc);

  });
  // apply transformation to entire csv file
  fs.createReadStream(file).pipe(parser).pipe(transform);
}

// set category id of a given presentation
function setCategory(event, presentationTitle, categoryID) {
  // console.log(presentationTitle);
  // console.log(categoryID);
  Presentation.update({ category_id: categoryID },
    { where: { title: presentationTitle }});

  event.returnValue = 1;
}

// count how many of each category appear
function countCategorized(event, arg) {
  Presentation.count({ where: {category_id: arg} }).then(c => {
    // console.log("actual id: " + arg + " count: " + c);
    event.returnValue = c;
  });
}

//queries the database for the full list of reviewers and their id for use
//on updating ratings
function queryReviewer(event) {
  Reviewer.findAll({
    attributes:['id', 'first', 'last']
  }).then(review => {
    event.sender.send('query-reviewer-reply', JSON.stringify(review));
  });
}

// get all presentations, presenters, and reviews
function queryPresentations (event) {
  Presentation.findAll({
    attributes: ['id', 'title', 'description', 'submission_date', 'objective_1', 'objective_2', 'objective_3', 'category_id', ],

    include: [
      {
        model: Attendee,
        as: 'Presenter'
      }, {
        model: Attendee,
        as: 'Copresenter1'
      }, {
        model: Attendee,
        as: 'Copresenter2'
      }, {
        model: Attendee,
        as: 'Copresenter3'
      }, {
        model: Review,
        as: 'PresentationReview',
        include: [
          {
            model: Reviewer,
            as: 'ReviewReviewer'
          }
        ]
      }
    ]
  }).then(presentations => {
    event.sender.send('query-presentations-reply', JSON.stringify(presentations));
  });
}

//query the database for the latest rating values for a presentation
//and send them back to the renderer in a JSON string
function queryRadio (event, arg) {
  var presentationID = arg;
  Review.findOne({
    where: {presentation_id: presentationID},
    attributes:['id', 'grammar_rating',
               'title_rating',
               'credibility_rating',
               'interest_rating',
               'content_rating',
               'novelty_rating',
               'overall_rating']
  }).then(review => {
    event.sender.send('query-radios-reply', JSON.stringify(review));
  });
}

// insert new category into database
function addCategory(event, categoryName) {
  // console.log('Add category: ' + categoryName);
  Category.findAll({
    where: {
      title: categoryName
    }
  }).then(categories => {
    if (categories.length != 0) {
      event.returnValue = -1;
      return;
    }

    Category.create({
      title: categoryName
    });
    event.returnValue = 1;
  });
}

// delete category in database
function deleteCategory(event, categoryID) {
  // console.log('destroy category: ' + categoryID);
  Category.destroy({
    where: {id: categoryID}
  });
  event.returnValue = "1";
}

// update category name
function updateCategoryName(event, categoryId, newValue) {
  // console.log("cID: " + categoryId);
  Category.update(
   {title: newValue},
   {where: { id: categoryId }});

  event.returnValue = newValue;
}

//Upserts the rating passed from the ipc renderer call tied to the reviewer
function updateRating (event, arg) {
  var ratings = arg;
  Review.create({
    reviewer_id: ratings.reviewerID,
    presentation_id: ratings.presID,
    grammar_rating: ratings.gramVal,
    title_rating: ratings.titleVal,
    credibility_rating: ratings.credVal,
    interest_rating: ratings.intrVal,
    content_rating: ratings.contVal,
    novelty_rating: ratings.novVal,
    overall_rating: ratings.overVal
  }).catch(Sequelize.ValidationError, function (err) {
    Review.update({
      grammar_rating: ratings.gramVal,
      title_rating: ratings.titleVal,
      credibility_rating: ratings.credVal,
      interest_rating: ratings.intrVal,
      content_rating: ratings.contVal,
      novelty_rating: ratings.novVal,
      overall_rating: ratings.overVal
    },{
      where: {
        reviewer_id: ratings.reviewerID,
        presentation_id: ratings.presID
      }
    })
  });
}

//Upserts a reviewer into the database
function updateReviewer (event, arg) {
  var reviewer = arg;
  Reviewer.create({
    first: reviewer.first,
    last: reviewer.last
  });
}

// sync accepted presentation presenters to EventMobi
function syncPresentersWithDatabase(event, people, sessions) {
  // get all presentations from database with accepted set to True
  Presentation.findAll({
    attributes: ['title', 'description', ],

    include: [
      {
        model: Attendee,
        as: 'Presenter'
      }, {
        model: Attendee,
        as: 'Copresenter1'
      }, {
        model: Attendee,
        as: 'Copresenter2'
      }, {
        model: Attendee,
        as: 'Copresenter3'
      }
    ],

    where: {
      accepted: true
    }
  }).then(dbPresentations => {
    // for each presentation
    for (var i = 0; i < dbPresentations.length; i++) {
      dbPresentation = dbPresentations[i];

      eventmobiPresentation = null;
      // find the presentation in EventMobi
      for (var j = 0; j < sessions.length; j++) {
        if (sessions[j].name == dbPresentation.title) {
          eventmobiPresentation = sessions[j];
          break;
        }
      }
      eventmobiSpeakers = [];
      TYPES_OF_SPEAKERS = ["Presenter", "Copresenter1", "Copresenter2", "Copresenter3"];
      iterate over each type of speaker
      for (var type = 0; type < TYPES_OF_SPEAKERS.length; type++) {
        if (dbPresentation[TYPES_OF_SPEAKERS[type]] == null) {
          break;
        }
        // get that speaker for presentation
        dbPerson = dbPresentation[TYPES_OF_SPEAKERS[type]];
        // iterate over EventMobi attendees to find the person's ID
        for (var j = 0; j < people.length; j++) {
          eventmobiPerson = people[j];
          // if people match, update their group ID to add them to the Speaker group
          if ((eventmobiPerson.first_name == dbPerson.prefix + " "+ dbPerson.first || eventmobiPerson.first_name == dbPerson.first) &&
              eventmobiPerson.last_name == dbPerson.last &&
              eventmobiPerson.email == dbPerson.email) {

            eventmobiSpeakers.push(eventmobiPerson.id);

            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                console.log("Person Updated");
              }
            };
            xmlHttp.open("PATCH", "https://api.eventmobi.com/v2/events/"+config.eventmobi.event_id+"/people/resources/"+eventmobiPerson.id);
            xmlHttp.setRequestHeader("Content-Type", "application/json");
            xmlHttp.setRequestHeader("X-API-KEY", config.eventmobi.api_key);
            xmlHttp.send('{ "group_ids": ["'+config.eventmobi.speaker_id+'"] }');
          }
        }
      }
      // add quotes around speakers for API call
      for (var j = 0; j < eventmobiSpeakers.length; j++) {
        eventmobiSpeakers[j] = "\""+eventmobiSpeakers[j]+"\"";
      }
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log("Event Updated");
        }
      };
      // Add speakers to the event page in EventMobi
      xmlHttp.open("PATCH", "https://api.eventmobi.com/v2/events/"+config.eventmobi.event_id+"/sessions/resources/"+eventmobiPresentation.id);
      xmlHttp.setRequestHeader("Content-Type", "application/json");
      xmlHttp.setRequestHeader("X-API-KEY", config.eventmobi.api_key);
      xmlHttp.send("{ \"roles\" : [{\"id\":\""+config.eventmobi.speaker_role_id+"\",\"name\":\"Speaker\",\"people_ids\":["+eventmobiSpeakers+"]}]}");
    }
    // set return value used in an Alert on success
    event.returnValue = "EventMobi Successfully Updated";
    // console.log("process sync")
  });
}

// get list of presentations from EventMobi
function getPresentations(event, people) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    // if there is a successful return, sync presenters of the Database with EventMobi
    if (this.readyState == 4 && this.status == 200) {
      var ret = JSON.parse(xmlHttp.responseText);
      syncPresentersWithDatabase(event, people, ret.data);
    }
  };
  // get presentations of given event_id
  xmlHttp.open("GET", "https://api.eventmobi.com/v2/events/"+config.eventmobi.event_id+"/sessions/resources?limit=1000");
  xmlHttp.setRequestHeader("Content-Type", "application/json");
  xmlHttp.setRequestHeader("X-API-KEY", config.eventmobi.api_key);
  xmlHttp.send();
}

// recursively continue to get people until no more pages
function evalPaginatedPeople(event, xmlHttp, out) {
  return function() {
    // if there is a successful
    if (this.readyState == 4 && this.status == 200) {
      // parse response text
      var ret = JSON.parse(xmlHttp.responseText);
      out = out.concat(ret.data);
      // if there is a next page, recursively iterate
      if (ret.meta.pagination.next_page) {
        // get next page and call this function
        xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = evalPaginatedPeople(event, xmlHttp, out);
        xmlHttp.open("GET", ret.meta.pagination.next_page);
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.setRequestHeader("X-API-KEY", config.eventmobi.api_key);
        xmlHttp.send();
      // if there isn't another page, go to presentation parsing
      } else {
        getPresentations(event, out);
      }
    }
  }
}

// set EventMobi attendees as presenters
function syncPresentersToEventmobi(event) {
  var xmlHttp = new XMLHttpRequest();
  var people = [];
  // Get list of all attendees in EventMobi, call evalPaginatedPeople to recursively get all pages
  xmlHttp.onreadystatechange = evalPaginatedPeople(event, xmlHttp, people);
  xmlHttp.open("GET", "https://api.eventmobi.com/v2/events/"+config.eventmobi.event_id+"/people/resources?limit=1000");
  xmlHttp.setRequestHeader("Content-Type", "application/json");
  xmlHttp.setRequestHeader("X-API-KEY", config.eventmobi.api_key);
  xmlHttp.send();
}

// IPC calls to connect backend to frontend
ipc.on('eventmobi-call', function(event, arg) {
  syncPresentersToEventmobi(event);
});

ipc.on('ingest-csv', function(event, arg) {
  ingestCSV(arg);
  queryPresentations(event);
});

ipc.on('query-presentations', function(event, arg) {
  queryPresentations(event);
});

ipc.on('get-category-count', function(event, arg) {
  countCategorized(event, arg);
})

ipc.on('update-category-name', function(event, arg) {
  updateCategoryName(event, arg.categoryId, arg.newValue);
})

ipc.on('get-categories', function(event, arg) {
  getCategories(event);
});

ipc.on('add-category', function(event, arg) {
  addCategory(event, arg);
});

ipc.on('delete-category', function(event, arg) {
  deleteCategory(event, arg);
})

ipc.on('set-category', function(event, arg) {
  setCategory(event, arg.presentation, arg.category);
});


//call the upsert for ratings with the value passed from the ratings screen
ipc.on('update-rating', function(event, arg) {
  event.returnValue = updateRating(event, arg);
});

//calls the select query for the radio button values passed from ratings screen
ipc.on('query-radios', function(event, arg) {
  event.returnValue = queryRadio(event, arg);
});

//calls the select query for the appropriate review passed from index
ipc.on('query-reviewer', function(event, arg) {
  event.returnValue = queryReviewer(event, arg);
});

//calls the upsert for reviewers passed from index
ipc.on('create-reviewer', function(event, arg) {
  event.returnValue = updateReviewer(event, arg);
})

app.on('ready', createWindow);
