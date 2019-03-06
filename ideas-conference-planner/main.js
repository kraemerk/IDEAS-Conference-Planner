var fs = require('fs');
const Sequelize = require('sequelize');
var config;
const electron = require('electron');
const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain;

ini = require('ini');

config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
  dialect: 'postgres',
  host: config.database.host,
  port: config.database.port,
  operatorsAliases: false,
  logging: false
});

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

const Reviewer = sequelize.define('reviewer', {
  first: Sequelize.TEXT,
  last: Sequelize.TEXT
}, {
  schema: config.database.schema,
  freezeTableName: true,
  timestamps: false
});

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
  overall_rating: Sequelize.INTEGER
}, {
  schema: config.database.schema,
  freezeTableName: true,
  timestamps: false
});


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


function getCategories(event) {
  Category.findAll({
    attributes: ['id', 'title'],
  }).then(categories => {
    event.returnValue =  JSON.stringify(categories);
  });
}



function ingestCSV (file) {
  var csv = require('csv');



  var options = {
    columns: true,
    trim: true,
    rtrim: true
  }

  var parser = csv.parse(options);

  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });


  var transform = csv.transform(function(row) {
    Object.keys(row).forEach((key) => {if (row[key] == '') row[key] = null});
    var presenter = Attendee.build({
      prefix: row['Prefix'],
      first: row['First Name'],
      last: row['Last Name'],
      email: row['Primary Presenter E-mail'],
      phone: row['Primary Presenter Contact Number'],
      agency: row['Primary Presenter Agency/School District:'],
      role: row['Which category best describes your role in your agency or school district?'],
    });
    var insertfunc = function(inserted) {
      var presenterId = inserted != null ? inserted.dataValues.id : null
      var copresenter1 = Attendee.build({
        prefix: row['Co-Presenter 1 (Prefix)'],
        first: row['Co-Presenter 1 (First Name)'],
        last: row['Co-Presenter 1 (Last Name)'],
        email: row['Co-Presenter 1'],
        agency: row['Co- Presenter 1 Agency/School District:']
      })
      var insertfunc = function(inserted) {
        var copresenter1Id = inserted != null ? inserted.dataValues.id : null
        var copresenter2 = Attendee.build({
          prefix: row['Co-Presenter 2 (Prefix)'],
          first: row['Co-Presenter 2 (First Name)'],
          last: row['Co-Presenter 2 (Last Name)'],
          email: row['Co-Presenter 2'],
          agency: row['Co- Presenter 2 Agency/School District:']
        })
        var insertfunc = function(inserted) {
          var copresenter2Id = inserted != null ? inserted.dataValues.id : null
          var copresenter3 = Attendee.build({
            prefix: row['Co-Presenter 3 (Prefix)'],
            first: row['Co-Presenter 3 (First Name)'],
            last: row['Co-Presenter 3 (Last Name)'],
            email: row['Co-Presenter 3'],
            agency: row['Co- Presenter 3 Agency/School District:']
          })

          var insertfunc = function(inserted) {
            var copresenter3Id = inserted != null ? inserted.dataValues.id : null

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
            insertObj(sequelize, presentation, {}, function(err) { console.log(err) });
          }
          var errfunc = function(err) {
            Attendee.findOne({ where: {prefix: copresenter3.prefix, first: copresenter3.first, last: copresenter3.last} }).then(attendee => {
              insertfunc(attendee)
            })
          }
          insertObj(sequelize, copresenter3, insertfunc, errfunc);

        }
        var errfunc = function(err) {
          Attendee.findOne({ where: {prefix: copresenter2.prefix, first: copresenter2.first, last: copresenter2.last} }).then(attendee => {
            insertfunc(attendee)
          })
        }
        insertObj(sequelize, copresenter2, insertfunc, errfunc);
      }
      var errfunc = function(err) {
        Attendee.findOne({ where: {prefix: copresenter1.prefix, first: copresenter1.first, last: copresenter1.last} }).then(attendee => {
          insertfunc(attendee)
        })
      }
      insertObj(sequelize, copresenter1, insertfunc, errfunc);
    }
    var errfunc = function(err) {
      Attendee.findOne({ where: {prefix: presenter.prefix, first: presenter.first, last: presenter.last} }).then(attendee => {
          insertfunc(attendee)
      })
    }

    insertObj(sequelize, presenter, insertfunc, errfunc);

  });

  fs.createReadStream(file).pipe(parser).pipe(transform);
}

function setCategory(presentationTitle, categoryID) {
  console.log(presentationTitle);
  console.log(categoryID);
  Presentation.update({ category_id: categoryID },
    { where: { title: presentationTitle }});
}

function countCategorized(event, arg) {
  
  Presentation.count({ where: {category_id: arg} }).then(c => {
    console.log("actual id: " + arg + " count: " + c);
    event.returnValue = c;
  });

}


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

function addCategory(event, categoryName) {
  console.log('Add category: ' + categoryName);
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

function deleteCategory(categoryID) {
  
  console.log('destroy category: ' + categoryID);
  Category.destroy({
    where: {id: categoryID}
  });

}


function updateRating (event, arg) {
  var ratings = arg;
  Review.create({
    reviewer_id: 1,
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
        reviewer_id: 1,
        presentation_id: ratings.presID
      }
    })
  });
}

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

ipc.on('get-categories', function(event, arg) {
  getCategories(event);
});

ipc.on('add-category', function(event, arg) {
  addCategory(event, arg);
});

ipc.on('delete-category', function(event, arg) {
  deleteCategory(arg);
})

ipc.on('set-category', function(event, arg) {
  setCategory(arg.presentation, arg.category);
});

ipc.on('update-rating', function(event, arg) {
  console.log(arg.presID);
  updateRating(event, arg);
});

ipc.on('validate-rater', function(event, arg) {
  validateRater(event,arg);
});

//ingestCSV('/Users/kkraemer/Library/MobileDocuments/com~apple~CloudDocs/Documents/GT/cs3312/presentations.csv');
app.on('ready', createWindow);
